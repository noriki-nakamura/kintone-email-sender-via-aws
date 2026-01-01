window.KintoneConfig = {
    apiEndpoint: 'YOUR_API_GATEWAY_URL',
    apiToken: 'YOUR_API_TOKEN',
    bccEmail: 'your-bcc-email@example.com',
    TEMPLATES: {
        'sample_template': {
            label: 'サンプルテンプレート',
            subject: 'サンプル件名(〇〇様)',
            body: `
                〇〇様

                これはサンプルです。
                必要に応じてテンプレートを追加・修正してください。
            `
        }
    }
};
