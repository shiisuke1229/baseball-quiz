'use strict';

{
  // index.htmlから必要な要素を取得
  const question = document.getElementById('question');
  const choices = document.getElementById('choices');
  const answer = document.getElementById('answer');
  const btn = document.getElementById('btn');
  const result = document.getElementById('result');  
  const scoreLabel = document.querySelector('#result > p');
  
  // クイズのデータ
  const quizSet = shuffle([
    // qは問題文の配列、cは選択肢の配列(配列の先頭が正解)、aは解説
    {q: '無死２, ３塁で、内野ゴロ。２塁ランナーと３塁ランナーはどうする？', c: ['両ランナーともスタートを切る。', '３塁ランナーはスタートを切り、２塁ランナーは戻る。', '両ランナーとも戻る。'], a: '解説：「ゴロ」ゴーの場面。両ランナーともスタートを切ることで、打球が外野に抜けた場合に２塁ランナーの生還率が高まる。ピッチャーゴロの場合は３塁ランナーが挟まれて、その間にバッターが２塁へ行く。'},    
    {q: '無死２塁で、ショートゴロ。２塁ランナーはどうする？？', c: ['３塁へスタートを切る。', '２塁へ戻る。','２塁と３塁の間で止まる。'], a: '解説：「ゴロ」ゴーの場面。２塁に戻るのがセオリーだが、草野球レベルでは３塁に走ってもアウトになることは少ない。'},
    {q: '２死１, ３塁で、１ボール２ストライク。１塁ランナーはいつスタートを切る？', c: ['バッターがスイングを始めた時。', 'バッターが打った時。', 'ピッチャーが投げた時。'], a: '解説：「スイング」ゴーの場面。２死２ストライクで、投球に対してバッターがスイングを始めたらスタートを切る。'},
    {q: '２死２塁で、１ボール２ストライク。２塁ランナーはいつスタートを切る？', c: ['ピッチャーの投球がストライクゾーンに向かった時。', 'バッターが打った時', 'ピッチャーが投げた時。'], a: '解説：「ストライク」ゴーの場面。２塁ランナーからストライクゾーンはよく見えるので、ピッチャーの投球がストライクゾーンに向かったらスタートを切る。'},
    {q: '０死２塁で、ピッチャーの投球がワンバウンドする軌道。２塁ランナーはどうする？', c: ['スタートを切り、キャッチャーが捕ったら戻る。', 'キャッチャーが弾いたらスタートを切る。', 'スタートを切り、キャッチャーが捕っても3塁へ行く。'], a: '解説：「軌道」ゴー。ピッチャーの投球がワンバウンドする軌道ならスタートを切り、キャッチャーが捕ったら急いで戻る。'},
  ]);
  // いま何問目かを管理する変数
  let currentNum = 0;
  // 回答したかを管理する変数
  let isAnswered;
  // 正答数を管理する
  let score = 0;

  // 選択肢をシャッフルする関数
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  }

  // 正誤判定の関数
  function checkAnswer(li) {
    // 回答済みの場合には処理をしない
    if (isAnswered) {
      return;
    }
    // 回答済みにする
    isAnswered = true;

    // 選択したリストが選択肢の配列の先頭と一致していれば正解
    if (li.textContent === quizSet[currentNum].c[0]) {
      // 正解したときの処理
      li.classList.add('correct');
      score++;
    } else {
      // 間違えたときの処理
      li.classList.add('wrong');
      answer.textContent = quizSet[currentNum].a;

    }

    // 回答後はボタンの色を青に戻す
    btn.classList.remove('disabled');
  }


  
  
  // 画面描画の処理の関数
  function setQuiz() {
    // まだ回答していないことを記録する
    isAnswered = false;
        
    // 何問目かを表示する
    document.getElementById('question_number').innerHTML = "第" + (currentNum + 1) + "問";
    
    // 問題文の埋め込み
    question.textContent = quizSet[currentNum].q;

    // 前の選択肢を削除する
    while (choices.firstChild) { 
      choices.removeChild(choices.firstChild);
    }

    // 選択肢を埋め込む
    // シャッフル関数に選択肢の配列のコピーを渡す
    const shuffledChoices = shuffle([...quizSet[currentNum].c]);
    // 一つ一つの要素をchoiceとして受け取る
    shuffledChoices.forEach(choice => {
      const li = document.createElement('li');
      li.textContent = choice;
      // 選択肢をクリックしたときに正誤判定を行う
      li.addEventListener('click', () => {
        checkAnswer(li);
      });
      choices.appendChild(li);
    });

    // 最後の問題だったら、ボタンのテキストを変える
    if (currentNum === quizSet.length - 1) {
      btn.textContent = '得点を見る';
    }      
  }

  setQuiz();

  // ボタンを押したときの処理
  btn.addEventListener('click', () => {
    // 回答前には次の問題に行けないようにする
    if (btn.classList.contains('disabled')) {
      return;
    }
    // 次の問題に移ったらボタンの色をグレーに変える
    btn.classList.add('disabled');

    // 最後の問題だったら、正答数を表示する
    if (currentNum === quizSet.length - 1) {
      scoreLabel.textContent = `Score: ${score} / ${quizSet.length}`;
      result.classList.remove('hidden');
    } else {
    // 最後の問題でなかったら、次の選択肢を表示する
      currentNum++;
      setQuiz();
    }
  });
}
