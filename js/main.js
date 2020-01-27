'use strict';

{
  // index.htmlから必要な要素を取得
  const question = document.getElementById('question');
  const choices = document.getElementById('choices');
  const answer = document.getElementById('answer');
  const btn = document.getElementById('btn');
  const result = document.getElementById('result');  
  const scoreLabel = document.getElementById('score');
  const commentLabel = document.getElementById('comment');
  
  // クイズのデータ
  const quizSet = shuffle([
    // qは問題文の配列、cは選択肢の配列(配列の先頭が正解)、aは解説
    {q: '無死２, ３塁でバッターが内野ゴロを打った。２塁ランナーと３塁ランナーはどうする？', c: ['どちらもスタートを切る。', '３塁ランナーはスタートを切り、２塁ランナーは戻る。', 'どちらも戻る。'], a: '＜解説＞「ゴロ」ゴーの場面。両ランナーとも打った瞬間にスタートを切ることで、打球が外野に抜けた場合に２塁ランナーもホームインできる。ピッチャーゴロの場合は、３塁ランナーが挟まれている間にバッターが２塁へ行く。', x: '<img src="img/scene1.png">'},    
    {q: '無死２塁でバッターがショートゴロを打った。２塁ランナーはどうする？', c: ['３塁へスタートを切る。', '２塁へ戻る。','２塁と３塁の間で止まる。'], a: '＜解説＞「ゴロ」ゴーの場面。セオリーでは２塁に戻ることになっているが、草野球レベルではショートが３塁に投げてアウトにするのは難しい。', x: '<img src="img/scene2.png">'},
    {q: '２死１, ３塁で２ストライクの場面。１塁ランナーはどのタイミングでスタートを切る？', c: ['バッターがスイングを始めた時。', 'バッターが打った時。', 'ピッチャーが投げた時。'], a: '＜解説＞「スイング」ゴーの場面。バッターがスイングを始めたらスタートを切る。', x: '<img src="img/scene3.png">'},
    {q: '２死２塁で２ストライクの場面。２塁ランナーはどのタイミングでスタートを切る？', c: ['ピッチャーの投球がストライクゾーンに向かった時。', 'バッターが打った時。', 'ピッチャーが投げた時。'], a: '＜解説＞「ストライク」ゴーの場面。２塁ランナーはピッチャーの投球がよく見えるので、投球がストライクになりそうだったらスタートを切る。', x: '<img src="img/scene4.png">'},
    {q: '０死２塁でピッチャーがワンバウンドする軌道の投球をした。２塁ランナーはどうする？', c: ['３塁へスタートを切り、キャッチャーが捕ったら２塁へ戻る。', 'キャッチャーが弾いたら３塁へスタートを切る。', '３塁へスタートを切り、キャッチャーが捕ってもそのまま３塁へ。'], a: '＜解説＞「軌道」ゴー。ピッチャーの投球がワンバウンドする軌道ならスタートを切り、キャッチャーが捕ったら急いで戻る。', x: '<img src="img/scene5.png">'},
  ]);

  // いま何問目かを管理する変数
  let currentNum = 0;

  // 回答したかを管理する変数
  let isAnswered;

  // 正答数を管理する変数
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

    // 状態を「回答済み」にする
    isAnswered = true;

    // 選択したリストが選択肢の配列の先頭と一致していれば正解とする
    if (li.textContent === quizSet[currentNum].c[0]) {
      // 正解したときの処理
      li.classList.add('correct');
      score++;
    } else {
      // 間違えたときの処理
      li.classList.add('wrong'); 
    }

    // 解説を表示する
    answer.textContent = quizSet[currentNum].a;

    // 回答後はボタンの色を青に戻す
    btn.classList.remove('disabled');
  }  
  
  // 画面描画の処理の関数
  function setQuiz() {
    // 状態を「未回答」にする
    isAnswered = false;
        
    // 何問目かを表示する
    document.getElementById('question_number').textContent = "第" + (currentNum + 1) + "問 / 全5問";
    
    // 問題文を表示する
    question.textContent = quizSet[currentNum].q;
    
    // 画像を表示する
    document.getElementById('image').innerHTML = quizSet[currentNum].x;


    // 前の問題の選択肢を削除する
    while (choices.firstChild) { 
      choices.removeChild(choices.firstChild);
    }

    // 前の問題の解説を削除する
    answer.textContent = "";

    // 選択肢を表示する
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

    // 最後の問題だったらボタンのテキストを「スコアを見る」にする
    if (currentNum === quizSet.length - 1) {
      btn.textContent = 'スコアを見る';
    }      
  }

  setQuiz();  

  // ボタンを押したときの処理
  btn.addEventListener('click', () => {
    // 未回答の場合は次の問題に進めないようにする
    if (btn.classList.contains('disabled')) {
      return;
    }
    // 新しい問題に進んだらボタンの色をグレーに変える
    btn.classList.add('disabled');

    // 最後の問題だったら正答数を表示する
    if (currentNum === quizSet.length - 1) {
      scoreLabel.textContent = `スコア： ${score} / ${quizSet.length}`;
      if (score === 5) {
        commentLabel.textContent = 'Excellent!';
      } else if (score === 4) {
        commentLabel.textContent = 'Great!';
      } else if (score === 3) {
        commentLabel.textContent = 'Good!';
      } else {
        commentLabel.textContent = '';
      }
      result.classList.remove('hidden');
    } else {
    // 最後の問題でなかったら次の選択肢を表示する
      currentNum++;
      setQuiz();
    }
  });
}
