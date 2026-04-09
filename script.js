// 1. 이미지 경로 설정
const images = {
  bg: {
    school: "assets/bg/school.jpg",
    cafe: "assets/bg/cafe.jpg",
    classroom: "assets/bg/classroom.jpg"
  },
  characters: {
    hyejin: "assets/characters/hyejin.png",
    sun: "assets/characters/sun.png",
    minki: "assets/characters/minki.png"
  }
};

// 2. 상태 변수
let index = 0;
let affection = {
  hyejin: 0,
  sun: 0,
  minki: 0,
  study: 0
};

// 3. 스토리 데이터
const story = [
  { name: "나", text: "여기가... 로스쿨인가.", bg: "school" },
  { name: "박혜진", text: "안녕하세요! 😊", characters: { center: "hyejin" }, effect: { hyejin: 1 } },
  { name: "장선", text: "…길도 못 찾고 서 있는 거야?", characters: { left: "sun", right: "hyejin" }, effect: { sun: 1 } },
  { name: "차민기", text: "…재밌네.", bg: "classroom", characters: { center: "minki" }, effect: { minki: 1 } },
  { name: "나", text: "첫 수업이 시작됐다.", bg: "classroom" },
  {
    name: "나",
    text: "집중할까?",
    choices: [
      { text: "열심히 듣는다", next: 6, effect: { study: 2 } },
      { text: "딴짓한다", next: 7, effect: { study: -1 } }
    ]
  },
  { name: "나", text: "교수님 설명이 이해된다." },
  { name: "나", text: "시간만 날린 느낌이다…" },
  {
    name: "나",
    text: "점심시간, 누구와 보낼까?",
    choices: [
      { text: "혜진이랑 밥", next: 9, effect: { hyejin: 2 } },
      { text: "장선이랑 밥", next: 12, effect: { sun: 2 } },
      { text: "혼자 공부", next: 15, effect: { study: 2 } }
    ]
  },
  { name: "박혜진", text: "같이 먹으니까 좋네요 😊", bg: "cafe", characters: { center: "hyejin" } },
  { name: "나", text: "혜진은 참 따뜻하다." },
  { name: "박혜진", text: "앞으로도 같이 있어줄래요?" },
  { name: "장선", text: "…왜 따라온 거야.", bg: "cafe", characters: { center: "sun" } },
  { name: "나", text: "장선이랑 있으면 긴장된다." },
  { name: "장선", text: "…그래도 나쁘진 않네.", characters: { center: "sun" } },
  { name: "나", text: "혼자 공부를 시작했다.", effect: { study: 2 } },
  { name: "나", text: "꽤 집중이 잘 된다." },
  { name: "나", text: "모의재판 준비가 시작됐다.", bg: "classroom" },
  {
    name: "나",
    text: "어떻게 준비할까?",
    choices: [
      { text: "자료조사", next: 20, effect: { study: 3 } },
      { text: "팀워크", next: 21, effect: { hyejin: 1, sun: 1 } }
    ]
  },
  { name: "나", text: "논리가 탄탄해졌다." },
  { name: "나", text: "팀워크가 좋아졌다." },
  { name: "차민기", text: "…너 꽤 재밌네.", characters: { center: "minki" }, effect: { minki: 2 } },
  { name: "나", text: "드디어 시험이다.", next: "exam" }
];

// 4. 효과 적용
function applyEffect(effect) {
  if (!effect) return;
  for (let key in effect) {
    affection[key] += effect[key];
  }
}

// 5. 렌더링
function render() {
  const current = story[index];

  if (current.effect) applyEffect(current.effect);

  // 🔥 배경 강제 적용 (핵심 수정)
  if (current.bg && images.bg[current.bg]) {
    const bgDiv = document.getElementById("background");

    bgDiv.style.backgroundImage = `url('${images.bg[current.bg]}')`;
    bgDiv.style.backgroundSize = "cover";
    bgDiv.style.backgroundPosition = "center";
    bgDiv.style.backgroundRepeat = "no-repeat";
  }

  // 🔥 캐릭터 완전 초기화 (핵심 수정)
  ["left", "center", "right"].forEach(pos => {
    const el = document.getElementById(`char-${pos}`);
    el.src = "";
    el.style.display = "none";
  });

  const charMap = {
    "박혜진": "hyejin",
    "장선": "sun",
    "차민기": "minki"
  };

  // 🔥 캐릭터 출력
  if (current.characters) {
    for (let pos in current.characters) {
      const key = current.characters[pos];
      const el = document.getElementById(`char-${pos}`);

      el.src = images.characters[key];
      el.style.display = "block";
    }
  } else if (charMap[current.name]) {
    const el = document.getElementById("char-center");

    el.src = images.characters[charMap[current.name]];
    el.style.display = "block";
  }

  document.getElementById("name").innerText = current.name;
  document.getElementById("text").innerText = current.text;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if (current.choices) {
    current.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.innerText = choice.text;
      btn.onclick = (e) => {
        e.stopPropagation();
        if (choice.effect) applyEffect(choice.effect);
        index = choice.next;
        render();
      };
      choicesDiv.appendChild(btn);
    });
    return;
  }

  if (current.next === "exam") {
    showExam();
    return;
  }
}

// 6. 시험
function showExam() {
  const { study } = affection;
  let result = study >= 6 ? "🎉 시험 대성공!" : study >= 3 ? "🙂 무난한 성적." : "💀 시험 망함...";

  document.getElementById("name").innerText = "시험 결과";
  document.getElementById("text").innerText = result;
  document.getElementById("choices").innerHTML = "<button onclick='showEnding()'>엔딩 보기</button>";

  ["left", "center", "right"].forEach(pos =>
    document.getElementById(`char-${pos}`).style.display = "none"
  );
}

// 7. 엔딩
function showEnding() {
  const { hyejin, sun, minki, study } = affection;
  let ending = "";
  let endingChar = "";

  if (minki >= 4 && study >= 5) {
    ending = "🔒 차민기 진엔딩";
    endingChar = "minki";
  } else if (hyejin >= 4) {
    ending = "💖 박혜진 해피엔딩";
    endingChar = "hyejin";
  } else if (sun >= 4) {
    ending = "🔥 장선 츤데레 엔딩";
    endingChar = "sun";
  } else if (study >= 6) {
    ending = "📚 공부 올인 엔딩";
  } else {
    ending = "😢 평범한 로스쿨 생활";
  }

  document.getElementById("name").innerText = "엔딩";
  document.getElementById("text").innerText =
    ending + `\n(혜진:${hyejin}, 장선:${sun}, 민기:${minki}, 공부:${study})`;

  if (endingChar) {
    const el = document.getElementById("char-center");
    el.src = images.characters[endingChar];
    el.style.display = "block";
  }

  document.getElementById("choices").innerHTML =
    "<button onclick='location.reload()'>다시하기</button>";
}

// 8. 클릭 이벤트
document.getElementById("dialogue-box").onclick = () => {
  if (index < story.length - 1 && !story[index].choices && story[index].next !== "exam") {
    index++;
    render();
  }
};

window.onload = render;
