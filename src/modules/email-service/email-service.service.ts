import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly RESEND_API = 'https://api.resend.com/emails';
  private readonly API_KEY = process.env.RESEND_API_KEY;

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<{ id: string; success: boolean }> {
    if (!to || !subject || !text) {
      throw new InternalServerErrorException('Faltan campos obligatorios para enviar el correo.');
    }

    const payload: any = {
      from: 'Pasantiando <onboarding@resend.dev>',
      to,
      subject,
      text,
    };

    if (html) {
      payload.html = html;
    }

    try {
      const response = await axios.post(this.RESEND_API, payload, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        id: response.data?.id || 'unknown',
        success: true,
      };
    } catch (error: any) {
      console.error('Error al enviar correo:', error?.response?.data || error.message);
      throw new InternalServerErrorException('No se pudo enviar el correo.');
    }
  }
}