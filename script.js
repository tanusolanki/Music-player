console.log('lets write javascript');
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

function getBaseURL() {
  return window.location.origin;
}

async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`${getBaseURL()}/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = " ";
  for (const song of songs) {
    songUL.innerHTML += `<li> 
                  <img class="invert1" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>  
                            <div class="playNow">
                              <span>Play Now</span>
                              <img class="invert1" src="img/play.svg" alt="">
                            </div> 
                  </li>`;
  }
  Array.from(document.querySelectorAll(".songlist li")).forEach(e => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`${getBaseURL()}/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`${getBaseURL()}/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                                <circle cx="12" cy="12" r="10" fill="#66cc66"></circle>
                                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black"></path>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function displayAlbums2() {
  let a = await fetch(`${getBaseURL()}/singersImages/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let circleContainer = document.querySelector("#circleContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/singersImages")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`${getBaseURL()}/singersImages/${folder}/info.json`);
      let response = await a.json();
      circleContainer.innerHTML += `<div data-folder="${folder}" class="singers">
                        <div class="play-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                                <circle cx="12" cy="12" r="10" fill="#66cc66"></circle>
                                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black"></path>
                            </svg>
                        </div>
                        <img src="/singersImages/${folder}/singer.jpg" alt="">
                        <h2>${response.title}<h2>
                        <p>${response.description}</p>
                    </div>`;
    }
  }
  Array.from(document.getElementsByClassName("singers")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`singersImages/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getsongs("songs/cs");
  playMusic(songs[0], true);
  displayAlbums();
  displayAlbums2();

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".lib").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".lib").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document.querySelector(".range input").addEventListener("change", e => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".vol>img").addEventListener("click", e => {
    if (e.target.src.includes("vol.svg")) {
      e.target.src = e.target.src.replace("vol.svg", "mute.svg");
      currentsong.volume = 0;
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "vol.svg");
      currentsong.volume = 0.10;
      document.querySelector(".range input").value = 10;
    }
  });
}

main();
