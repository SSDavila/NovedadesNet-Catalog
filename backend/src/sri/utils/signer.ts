import * as fs from 'fs';
import * as forge from 'node-forge';
import { Crypto } from '@peculiar/webcrypto';
import * as xadesjs from 'xadesjs';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

import * as xpath from 'xpath';
import * as XmlCore from 'xml-core';

XmlCore.setNodeDependencies({
  DOMParser,
  XMLSerializer,
  xpath,
});

const crypto = new Crypto();
xadesjs.Application.setEngine('OpenSSL', crypto);

export class SriSigner {
  static async signXml(xml: string, p12Path: string, password: string): Promise<string> {
    try {
      const p12Buffer = fs.readFileSync(p12Path);
      const p12Asn1 = forge.asn1.fromDer(forge.util.createBuffer(p12Buffer.toString('binary')));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

      let key: CryptoKey | null = null;
      let cert: string | null = null;
      
      for (const safeContents of p12.safeContents) {
        for (const safeBag of safeContents.safeBags) {
          if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
            const privateKey = safeBag.key;

            const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
            const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
            const privateKeyDer = forge.asn1.toDer(privateKeyInfo).getBytes();
            
            key = await crypto.subtle.importKey(
              'pkcs8',
              this.stringToArrayBuffer(privateKeyDer),
              { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' },
              true,
              ['sign']
            );
          } else if (safeBag.type === forge.pki.oids.certBag) {
             const certAsn1 = forge.pki.certificateToAsn1(safeBag.cert);
             cert = forge.util.encode64(forge.asn1.toDer(certAsn1).getBytes());
          }
        }
      }

      if (!key || !cert) {
        throw new Error('Could not extract private key or certificate from .p12 file');
      }

      const doc = new DOMParser().parseFromString(xml, 'application/xml');

      const signedXml = new xadesjs.SignedXml();
      const x509 = this.pemToDer(cert);
      
      await signedXml.Sign(
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' } as any,
        key,
        doc,
        {
          keyValue: key,
          references: [
            { hash: 'SHA-1', transforms: ['enveloped', 'c14n'], uri: '#comprobante' }
          ],
          x509: [x509],
          signingCertificate: x509,
        }
      );

      return signedXml.toString();

    } catch (error) {
      console.error('Error signing XML:', error);
      throw new Error(`Failed to sign XML: ${error.message}`);
    }
  }

  private static stringToArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  private static pemToDer(pem: string): string {
    return pem.replace(/-----BEGIN CERTIFICATE-----/g, '').replace(/-----END CERTIFICATE-----/g, '').replace(/\s/g, '');
  }
}
