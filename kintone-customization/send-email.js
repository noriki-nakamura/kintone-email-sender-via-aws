(function () {
    'use strict';

    // API Gateway のエンドポイントURL
    const API_ENDPOINT = window.KintoneConfig.apiEndpoint;

    // Kintone UI のイベント
    kintone.events.on('app.record.detail.show', function (event) {
        const record = event.record;

        // ボタン要素の作成
        const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
        const sendButton = document.createElement('button');
        sendButton.textContent = 'メール送信';
        sendButton.style.backgroundColor = '#3498db';
        sendButton.style.color = 'white';
        sendButton.style.border = 'none';
        sendButton.style.padding = '10px 20px';
        sendButton.style.borderRadius = '4px';
        sendButton.style.cursor = 'pointer';
        sendButton.style.fontWeight = 'bold';
        sendButton.onmouseover = function () { sendButton.style.backgroundColor = '#2980b9'; };
        sendButton.onmouseout = function () { sendButton.style.backgroundColor = '#3498db'; };

        // ボタンクリック時の処理
        sendButton.onclick = function () {
            // 確認ダイアログ
            if (!confirm('このレコードの内容でメールを送信しますか？')) {
                return;
            }

            // 送信データの準備
            const email = record['recipientEmail'] ? record['recipientEmail'].value : '';
            const subject = record['emailSubject'] ? record['emailSubject'].value : '';
            const body = record['emailBody'] ? record['emailBody'].value : '';

            if (!email) {
                alert('宛先メールアドレスが設定されていません。');
                return;
            }

            const payload = {
                to: email,
                bcc: window.KintoneConfig.bccEmail,
                subject: subject,
                message: body
            };

            // ボタンを無効化（二重送信防止）
            sendButton.disabled = true;
            sendButton.textContent = '送信中...';

            // API リクエスト
            kintone.proxy(
                API_ENDPOINT,
                'POST',
                { 'Content-Type': 'application/json', 'x-api-token': window.KintoneConfig.apiToken },
                payload,
                function (body, status, headers) {
                    // 成功時のコールバック
                    sendButton.disabled = false;
                    sendButton.textContent = 'メール送信';

                    if (status === 200) {
                        alert('メールを送信しました！');
                    } else {
                        console.error('API Error:', body);
                        alert('メール送信に失敗しました。\n' + body);
                    }
                },
                function (error) {
                    // 失敗時のコールバック (ネットワークエラー等)
                    sendButton.disabled = false;
                    sendButton.textContent = 'メール送信';
                    console.error('Network Error:', error);
                    alert('ネットワークエラーが発生しました。');
                }
            );
        };

        headerSpace.appendChild(sendButton);
        return event;
    });
})();
