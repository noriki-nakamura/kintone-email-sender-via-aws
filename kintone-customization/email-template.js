(function () {
    'use strict';

    // イベント: レコード編集画面、レコード追加画面
    const events = ['app.record.edit.show', 'app.record.create.show'];

    kintone.events.on(events, function (event) {


        // Configがロードされていない、またはテンプレートがない場合は処理しない
        if (!window.KintoneConfig || !window.KintoneConfig.TEMPLATES) {
            return event;
        }
        const TEMPLATES = window.KintoneConfig.TEMPLATES;

        // ヘッダーメニュースペース要素を取得
        const headerMenuSpace = kintone.app.record.getHeaderMenuSpaceElement();

        // 既に存在する場合は作成しない(重複防止)
        if (document.getElementById('kintone-email-template-select')) {
            return event;
        }

        // ラベル作成
        const label = document.createElement('span');
        label.innerText = 'テンプレート: ';
        label.style.marginLeft = '10px';
        label.style.marginRight = '5px';
        label.style.verticalAlign = 'middle';

        // セレクトボックス作成
        const select = document.createElement('select');
        select.id = 'kintone-email-template-select';
        select.style.padding = '8px';
        select.style.borderRadius = '4px';
        select.style.border = '1px solid #e3e7e8';
        select.style.backgroundColor = '#f7f9fa';
        select.style.cursor = 'pointer';
        select.style.verticalAlign = 'middle';

        // デフォルトオプション
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '選択してください...';
        select.appendChild(defaultOption);

        // テンプレートオプションを追加
        for (const key in TEMPLATES) {
            if (Object.prototype.hasOwnProperty.call(TEMPLATES, key)) {
                const tmpl = TEMPLATES[key];
                const option = document.createElement('option');
                option.value = key;
                option.text = tmpl.label;
                select.appendChild(option);
            }
        }

        // 変更時の処理
        select.onchange = function () {
            const selectedKey = select.value;
            if (!selectedKey || !TEMPLATES[selectedKey]) {
                return;
            }

            const template = TEMPLATES[selectedKey];

            // 現在のレコードデータを取得
            const recordData = kintone.app.record.get();
            const record = recordData.record;

            // 名前フィールドの取得 (フィールドコード 'name' を想定)
            let recName = 'お客様';
            if (record['name'] && record['name'].value) {
                recName = record['name'].value;
            }

            // テンプレート内の '〇〇' を名前に置換
            // インデント対策: 行頭の空白を削除し、前後の空白もトリム
            const cleanBody = template.body.replace(/^[ ]+/gm, '').trim();
            const newSubject = template.subject.replace(/〇〇/g, recName);
            const newBody = cleanBody.replace(/〇〇/g, recName);

            // 確認ダイアログ（上書き防止）
            const currentSubject = record['emailSubject'] ? record['emailSubject'].value : '';
            const currentBody = record['emailBody'] ? record['emailBody'].value : '';

            if ((currentSubject || currentBody) && !confirm('現在入力されている件名・本文は上書きされます。よろしいですか？')) {
                select.value = '';
                return;
            }

            // フィールドに値をセット
            if (record['emailSubject']) {
                record['emailSubject'].value = newSubject;
            }
            if (record['emailBody']) {
                record['emailBody'].value = newBody;
            }

            // データを反映
            kintone.app.record.set(recordData);
        };

        // 要素をヘッダーに追加
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.appendChild(label);
        container.appendChild(select);

        headerMenuSpace.appendChild(container);

        return event;
    });

})();
