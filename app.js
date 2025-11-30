document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput").files[0];
    const resultBox = document.getElementById("resultBox");
    resultBox.className = "";
    resultBox.innerHTML = "";

    if (!fileInput) {
        resultBox.innerHTML = "ファイルを選択してください。";
        return;
    }

    // ファイル内容取得
    let text = "";
    if(fileInput.type === "application/pdf") {
        // PDF.jsで読み込み
        const pdf = await pdfjsLib.getDocument(fileInput).promise;
        for(let i=1; i<=pdf.numPages; i++){
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ");
        }
    } else {
        // TXTファイル
        const reader = new FileReader();
        await new Promise(resolve => {
            reader.onload = () => {
                text = reader.result;
                resolve();
            };
            reader.readAsText(fileInput);
        });
    }

    text = text.toLowerCase();

    // キーワード診断
    let score = 0;
    let advice = [];

    if(text.includes("手作業") || text.includes("紙")){
        score += 2;
        advice.push("紙・手作業のプロセスをデジタル化しましょう。");
    }
    if(text.includes("共有できない") || text.includes("情報が散乱")){
        score += 2;
        advice.push("情報共有ツールの導入を検討してください。");
    }
    if(text.includes("人手不足") || text.includes("効率")){
        score += 1;
        advice.push("業務効率化ツール（自動化）の導入が効果的です。");
    }
    if(text.includes("クラウド") || text.includes("saas")){
        score += 2;
        advice.push("クラウドサービスの導入を検討しましょう。");
    }

    // 一問一答スコア
    const q1 = parseInt(document.getElementById("q1").value);
    const q2 = parseInt(document.getElementById("q2").value);
    const q3 = parseInt(document.getElementById("q3").value);

    score += q1 + q2 + q3;

    if(q1 === 1) advice.push("導入済みのシステムを活用できる体制を整えましょう。");
    if(q1 === 2) advice.push("システム導入を検討しましょう。");
    if(q2 === 1) advice.push("補助金の活用方法を具体的に検討しましょう。");
    if(q2 === 2) advice.push("IT導入補助金を調べて活用できるようにしましょう。");
    if(q3 === 1) advice.push("IT研修をもう少し定期的に行うことを検討しましょう。");
    if(q3 === 2) advice.push("スタッフ向けIT研修を計画的に実施しましょう。");

    // スコアに応じて色分け
    if(score <= 4) resultBox.className = "low";
    else if(score <= 7) resultBox.className = "medium";
    else resultBox.className = "high";

    // 結果表示
    resultBox.innerHTML = `<p><strong>診断スコア：</strong>${score}</p>
                           <ul>${advice.map(a => `<li>${a}</li>`).join("")}</ul>`;
});
