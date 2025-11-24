import * as soap from 'soap';

const SRI_URLS = {
  TEST: {
    RECEPCION: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    AUTORIZACION: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
  },
  PROD: {
    RECEPCION: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    AUTORIZACION: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
  },
};

export class SriSoap {
  static async sendReceipt(xmlBase64: string, isProduction: boolean = false): Promise<any> {
    const wsdl = isProduction ? SRI_URLS.PROD.RECEPCION : SRI_URLS.TEST.RECEPCION;
    
    try {
      const client = await soap.createClientAsync(wsdl);
      const result = await client.validarComprobanteAsync({ xml: xmlBase64 });
      return result[0];
    } catch (error) {
      console.error('Error sending receipt to SRI:', error);
      throw new Error(`SRI Receipt Error: ${error.message}`);
    }
  }

  static async requestAuthorization(accessKey: string, isProduction: boolean = false): Promise<any> {
    const wsdl = isProduction ? SRI_URLS.PROD.AUTORIZACION : SRI_URLS.TEST.AUTORIZACION;

    try {
      const client = await soap.createClientAsync(wsdl);
      const result = await client.autorizacionComprobanteAsync({ claveAccesoComprobante: accessKey });
      return result[0];
    } catch (error) {
      console.error('Error requesting authorization from SRI:', error);
      throw new Error(`SRI Authorization Error: ${error.message}`);
    }
  }
}
