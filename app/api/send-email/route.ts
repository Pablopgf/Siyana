import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables');
      return NextResponse.json({ 
        error: 'Email service not configured. Please check RESEND_API_KEY in .env.local' 
      }, { status: 500 });
    }

    const { shippingData, transactionHash } = await request.json();
    
    if (!shippingData || !transactionHash) {
      return NextResponse.json({ 
        error: 'Missing shipping data or transaction hash' 
      }, { status: 400 });
    }

    console.log('Attempting to send email with Resend API key:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
    console.log('Shipping data:', shippingData);
    console.log('Transaction hash:', transactionHash);

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'SIYANA <noreply@siyanastudios.xyz>',
      to: ['pablopgf46@gmail.com'],
      subject: `🛍️ Nueva compra SIYANA - ${shippingData.name} ${shippingData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
            🛍️ Nueva Compra Realizada
          </h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #000; margin-top: 0;">📋 Detalles de la Transacción</h3>
            <p><strong>Hash de Transacción:</strong> <code>${transactionHash}</code></p>
            <p><strong>Ver en BaseScan:</strong> <a href="https://basescan.org/tx/${transactionHash}" style="color: #007bff;">Ver transacción</a></p>
          </div>
          
          <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <h3 style="color: #000; margin-top: 0;">📦 Datos de Envío</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.name} ${shippingData.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Dirección:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.address}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Piso:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.flatNumber || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Estado:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.state}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Ciudad:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.city}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Código Postal:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.postCode}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingData.prefix} ${shippingData.mobile}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
            <p style="margin: 0; color: #2d5a2d;"><strong>✅ Compra procesada exitosamente</strong></p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
              Los datos de envío han sido registrados y la transacción blockchain ha sido confirmada.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ 
        error: `Resend API error: ${error.message || 'Unknown error'}` 
      }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({ 
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 