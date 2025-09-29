import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  InternalServerErrorException 
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Controller('ai')
export class AiController {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada en el .env');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  @Post('generate-description')
  @HttpCode(HttpStatus.OK)
  async generateDescription(@Body('productName') productName: string) {
    if (!productName) {
      return { description: '' };
    }

    const prompt = `
Genera una descripción de producto atractiva y profesional para: "${productName}". No incluyas ninguna frase introductoria o preámbulo en tu respuesta. Comienza directamente con la descripción.
La descripción debe seguir esta estructura exacta y usar saltos de línea para separar las secciones:

1.  Párrafo Principal (exactamente 3 líneas): Un párrafo introductorio y llamativo que describa el producto, sus beneficios y a quién va dirigido. Usa un tono amigable y profesional. El párrafo debe terminar con un emoji relevante.

2.  📝 Características:

    (⚠️ Asegúrate de dejar un salto de línea aquí antes de comenzar los ítems)

    Una lista con 5 a 6 características clave del producto, las más importantes. Las características deben ser reales y basadas en información del producto consultada en internet, no inventadas. Cada característica debe ser concisa, destacar un punto fuerte y empezar con un emoji único y relevante (no uses el mismo emoji para todas).

3.  📍 Ubicación:
    Un texto fijo que indique la ubicación de la tienda. Por ejemplo: "Visítanos en nuestro local físico en [Tu Dirección Aquí] para verlo en persona." Después de esto agrega:
    📦 Envíos: A nivel nacional con garantía de entrega segura.
    🤝 Opciones de entrega en Quito: En local o envíos a domicilio con un valor adicional según tu sector.

Ejemplo de formato de salida para un producto ficticio "Lámpara Inteligente Solari":
"
Ilumina tu vida con la nueva Lámpara Inteligente Solari, la fusión perfecta de tecnología y diseño. Controla la luz desde tu móvil, crea ambientes únicos y ahorra energía con estilo. ¡La iluminación del futuro ha llegado a tu hogar! 💡

📝 Características:

🌈 Millones de colores para cada momento.
🗣️ Compatible con asistentes de voz.
⏰ Programación de encendido y apagado.

📍 Ubicación: Visítanos en nuestro local físico en [Tu Dirección Aquí] para verlo en persona.
📦 Envíos: A nivel nacional con garantía de entrega segura.
🤝 Opciones de entrega en Quito: En local o envíos a domicilio con un valor adicional según tu sector.
"

Ahora, genera la descripción para "${productName}" siguiendo estrictamente el formato del ejemplo.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return { description: text.trim() };
    } catch (error) {
      console.error('Error al generar descripción con Gemini:', error);
      throw new InternalServerErrorException('No se pudo generar la descripción desde la IA.');
    }
  }
}
