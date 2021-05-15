const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// render list songs
// render current song
// scroll into view
// play pause music
class App {
    constructor(
        audio,
        banner,
        bannerImg,
        player,
        playlists,
        playButton,
        prevButton,
        nextButton,
        repeatButton,
        shuffleButton,
        inputProcess,
        songName
    ) {
        // Bind Elements
        this.audio = audio;
        this.banner = banner;
        this.bannerImg = bannerImg;
        this.player = player;
        this.playlists = playlists;
        this.playButton = playButton;
        this.prevButton = prevButton;
        this.nextButton = nextButton;
        this.repeatButton = repeatButton;
        this.inputProcess = inputProcess;
        this.shuffleButton = shuffleButton;
        this.songName = songName;
        this.isPlaying = false;
        this.isSlide = false;
        this.isRepeat = this.getLocalStorage("isRepeat")
            ? this.getLocalStorage("isRepeat")
            : false;
        this.isShuffle = this.getLocalStorage("isShuffle")
            ? this.getLocalStorage("isShuffle")
            : false;
        this.curTime = this.getLocalStorage("curTime")
            ? this.getLocalStorage("curTime")
            : false;
        this.songs = [
            {
                name: "Dù Cho Mai Về Sau",
                singer: "Bùi Trường Linh",
                path: "./assets/audio/duchomaivesau.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2020/11/16/a/9/3/7/1605520682897_500.jpg",
            },
            {
                name: "Sài Gòn Đau Lòng Quá",
                singer: "Hứa Kim Tuyền x Hoàng Duyên",
                path: "./assets/audio/saigondaulongqua.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2021/03/27/d/2/9/1/1616859493571_500.jpg",
            },
            {
                name: "Laylalay",
                singer: "Jack - J97",
                path: "./assets/audio/laylalay.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2021/04/13/9/7/d/5/1618248252948_500.jpg",
            },
            {
                name: "Muộn Rồi Mà Sao Còn",
                singer: "Sơn Tùng M-TP",
                path: "./assets/audio/muonroimasaocon.mp3",
                image: "https://data.chiasenhac.com/data/cover/140/139611.jpg",
            },
            {
                name: "Câu Hẹn Câu Thề",
                singer: "Đình Dũng x ACV",
                path: "./assets/audio/cauhencauthe.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2021/03/29/2/2/1/e/1617029681297.jpg",
            },
            {
                name: "Nàng Thơ",
                singer: "Hoàng Dũng",
                path: "./assets/audio/nangtho.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2020/07/31/c/5/8/9/1596188259603.jpg",
            },
            {
                name: "Gác Lại Âu Lo",
                singer: "Da LAB x Miu Lê",
                path: "./assets/audio/gaclaiaulo.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2020/07/24/f/6/5/1/1595564868985.jpg",
            },
            {
                name: "Tháng Mấy Em Nhớ Anh?",
                singer: "Hà Anh Tuấn",
                path: "./assets/audio/thangmayemnhoanh.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2021/04/01/e/2/b/5/1617248289520_500.jpg",
            },
            {
                name: "Thương Em Là Điều Anh Không Thể Ngờ",
                singer: "Noo Phước Thịnh",
                path: "./assets/audio/thuongemladieuanhkhongthengo.mp3",
                image: "https://avatar-ex-swe.nixcdn.com/song/2018/12/18/2/c/1/f/1545098338244_500.jpg",
            },
        ];
        this.curIndex = this.getLocalStorage("curIndex")
            ? this.getLocalStorage("curIndex")
            : 0;

        // init active for repeat and shuffle button
        if (this.isRepeat) {
            this.repeatButton.classList.add("red");
        }
        if (this.isShuffle) {
            this.shuffleButton.classList.add("red");
        }

        // set current time
        if (this.curTime) {
            this.audio.currentTime = this.curTime;
        }

        // Create Range Slider
        rangesliderJs.create(this.inputProcess, {
            min: 0,
            max: 100,
            value: 0,
            step: 1,
            onInit: (value, percent, position) => {},
            onSlideStart: (value, percent, position) => {},
            onSlide: (value, percent, position) => {
                this.isSlide = true;
            },
            onSlideEnd: (value, percent, position) => {
                this.isSlide = false;
                const currentProcess = (value * this.audio.duration) / 100;
                this.audio.currentTime = currentProcess;
            },
        });

        // Render UI
        this.render();

        // Handel Events
        this.handleEvents();

        // Render Current Song UI
        this.renderCurrentSong();
    }

    // render list songs UI
    render() {
        const htmls = this.songs.map((song) => {
            return `<li class="playlists__song">
                        <div class="playlists__song-img banner">
                        <div class="banner__img" style="background-image: url(${song.image})"></div>
                        </div>
                        <div class="playlists__song-info">
                        <h3 class="info__name">${song.name}</h3>
                        <p class="info__author">${song.singer}</p>
                        </div>
                        <div class="playlists__song-option"><a class="btn btn-option"><i class="fas fa-ellipsis-h"></i></a></div>
                    </li>`;
        });
        this.playlists.innerHTML = htmls.join("");
    }

    // Handle Events
    handleEvents() {
        // bind this
        const _this = this;

        // Scroll into view
        const oldWidth = this.banner.offsetWidth;
        window.addEventListener("scroll", (e) => {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            const newWidth = oldWidth - scroll;
            _this.banner.style.width = newWidth > 0 ? newWidth + "px" : 0;
            _this.banner.style.opacity = newWidth / oldWidth;
        });

        // rotate disk
        const animate = _this.bannerImg.animate(
            { transform: "rotate(360deg)" },
            { iterations: Infinity, duration: 10000 }
        );
        animate.pause();

        // Handle play and pause audio
        this.playButton.addEventListener("click", (e) => {
            if (_this.isPlaying) {
                _this.audio.pause();
                animate.pause();
            } else {
                _this.audio.play();
                animate.play();
            }
        });

        // Listen when audio play
        this.audio.addEventListener("play", (e) => {
            _this.isPlaying = true;
            _this.player.classList.add("playing");
        });

        // Listen when audio pause
        this.audio.addEventListener("pause", (e) => {
            _this.isPlaying = false;
            _this.player.classList.remove("playing");
        });

        // Update process UI
        this.audio.addEventListener("timeupdate", () => {
            const duration = _this.audio.duration;
            const currentTime = _this.audio.currentTime;
            const percentage = (currentTime / duration) * 100;

            // setting curTime in realtime
            _this.setLocalStorage("curTime", currentTime);

            // Check if not slide then update process
            if (!_this.isSlide) {
                const audioProcess = _this.inputProcess["rangeslider-js"];
                audioProcess.update({ value: percentage });
            }
        });

        // Listen when click choose current song
        Array.from(this.playlists.children).forEach((child, index) => {
            child.addEventListener("click", (e) => {
                if (_this.isPlaying) {
                    // set range = 0
                    const audioProcess = _this.inputProcess["rangeslider-js"];
                    audioProcess.update({ value: 0 });

                    // wait loaded song until can play
                    _this.audio.addEventListener(
                        "loadeddata",
                        function forcePlay() {
                            _this.audio.play();
                            _this.audio.removeEventListener(
                                "loadeddata",
                                forcePlay
                            );
                        }
                    );
                }
                _this.curIndex = index;
                _this.setLocalStorage("curIndex", _this.curIndex);
                _this.renderCurrentSong();
            });
        });

        // Listen next button
        this.nextButton.addEventListener("click", () => {
            _this.nextSong();
            _this.renderCurrentSong();
        });

        // Listen previous button
        this.prevButton.addEventListener("click", () => {
            _this.prevSong();
            _this.renderCurrentSong();
        });

        // Listen when end song
        this.audio.addEventListener("ended", function () {
            if (_this.isRepeat) {
                this.play();
            } else if (_this.isShuffle) {
                _this.curIndex = _this.randomIndex();
                _this.setLocalStorage("curIndex", _this.curIndex);
                _this.renderCurrentSong();
                this.play();
            } else {
                _this.nextButton.click();
            }
        });

        // Listen repeat button
        this.repeatButton.addEventListener("click", function () {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("red");
            _this.setLocalStorage("isRepeat", _this.isRepeat);
        });

        // Listen shuffle button
        this.shuffleButton.addEventListener("click", function () {
            this.classList.toggle("red");
            _this.isShuffle = !_this.isShuffle;
            _this.setLocalStorage("isShuffle", _this.isShuffle);
        });

        // Listen window press enter
        window.addEventListener("keypress", (e) => {
            e.preventDefault();
            if (e.keyCode === 32) {
                _this.playButton.click();
            }
        });
    }

    // Get current song
    getCurrentSong() {
        return this.songs[this.curIndex];
    }

    // Render current song
    renderCurrentSong() {
        const curSong = this.getCurrentSong();
        this.songName.innerText = curSong.name;
        this.bannerImg.style.backgroundImage = `url(${curSong.image})`;
        this.audio.src = curSong.path;
        this.removeActiveAllSongs();
        this.addActiveCurrentSong();
    }

    // Add active current song
    addActiveCurrentSong() {
        const curSong = this.playlists.children[this.curIndex];
        curSong.classList.add("active");
    }

    // remove active for all songs
    removeActiveAllSongs() {
        Array.from(this.playlists.children).forEach((child) => {
            if (child.classList.contains("active")) {
                child.classList.remove("active");
            }
        });
    }

    // Increase index
    nextSong() {
        this.curIndex++;
        if (this.curIndex >= this.songs.length) {
            this.curIndex = 0;
        }
        this.setLocalStorage("curIndex", this.curIndex);
        this.audio.onloadeddata = () => {
            this.audio.play();
        };
    }

    // Decrease index
    prevSong() {
        this.curIndex--;
        if (this.curIndex < 0) {
            this.curIndex = this.songs.length - 1;
        }
        this.setLocalStorage("curIndex", this.curIndex);
        this.audio.onloadeddata = () => {
            this.audio.play();
        };
    }

    // Shuffle
    randomIndex() {
        return Math.floor(Math.random() * this.songs.length);
    }

    // set song to LocalStorage
    setLocalStorage(key, index) {
        localStorage.setItem(key, JSON.stringify(index));
    }

    getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}

const audio = $(".audio");
const banner = $(".banner");
const bannerImage = $(".banner__img");
const player = $(".player");
const playlists = $(".playlists");
const playButton = $(".control__toggle-play");
const prevButton = $(".btn-previous");
const nextButton = $(".btn-next");
const repeatButton = $(".btn-repeat");
const shuffleButton = $(".btn-shuffle");
const songName = $(".header h2");
const inputProcess = $(".range-slider-input.process");

const app = new App(
    audio,
    banner,
    bannerImage,
    player,
    playlists,
    playButton,
    prevButton,
    nextButton,
    repeatButton,
    shuffleButton,
    inputProcess,
    songName
);
