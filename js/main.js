let app = new Vue({
	el: '.main',
	data: {
		showMain: true,
		showSocial: false,
		showAchivment: false,
		showQuestions: false,
		showResults: false,
		number: 0,
		score: {
			zerg: 0,
			primal: 0,
			protoss: 0,
			tildarim: 0,
			terran: 0,
			infested: 0,
			hybrid: 0,
		},
		totalGame: localStorage.getItem('sc2TotalGame')
			? JSON.parse(localStorage.getItem('sc2TotalGame'))
			: {
					zerg: 0,
					primal: 0,
					protoss: 0,
					taldarim: 0,
					terran: 0,
					infested: 0,
					hybrid: 0,
			  },
		totalGames: localStorage.getItem('sc2TotalGames') ? localStorage.getItem('sc2TotalGames') : 0,
		questions: questions,
		results: results,
		resultRace: 'infested',
	},
	methods: {
		goToMain() {
			this.showMain = true
			this.showSocial = false
			this.showAchivment = false
			this.showQuestions = false
			this.showResults = false
		},
		goToSocial() {
			this.showMain = false
			this.showSocial = true
			this.showAchivment = false
			this.showQuestions = false
			this.showResults = false
		},
		goToAchivment() {
			if (this.totalGames > 0) {
				this.showMain = false
				this.showSocial = false
				this.showAchivment = true
				this.showQuestions = false
				this.showResults = false
			} else {
				this.goToQuestions()
			}
		},
		goToQuestions() {
			this.score = {
				zerg: 0,
				primal: 0,
				protoss: 0,
				taldarim: 0,
				terran: 0,
				infested: 0,
				hybrid: 0,
			}
			this.showMain = false
			this.showSocial = false
			this.showAchivment = false
			this.showQuestions = true
			this.showResults = false
		},
		goToResults(race) {
			this.showMain = false
			this.showSocial = false
			this.showAchivment = false
			this.showQuestions = false
			this.showResults = true
			this.resultRace = race
		},
		nextQuestions(answer) {
			if (this.number == 24) {
				this.number = 0
				this.endGame()
			} else {
				this.number++
			}
			eval(answer)
		},
		endGame() {
			this.totalGames++
			localStorage.setItem('sc2TotalGames', this.totalGames)
			// zerg
			if (
				this.score.zerg > this.score.protoss &&
				this.score.zerg > this.score.terran &&
				this.score.zerg < 8 &&
				Math.abs(this.score.protoss - this.score.zerg) > 3
			) {
				this.goToResults('zerg')
				this.totalGame.zerg++
			} else if (
				//primal
				this.score.primal > this.score.protoss &&
				this.score.primal > this.score.terran &&
				this.score.primal == 8
			) {
				this.goToResults('primal')
				this.totalGame.primal++
			} else if (
				//protoss
				this.score.protoss > this.score.zerg &&
				this.score.protoss > this.score.terran &&
				this.score.taldarim < 5 &&
				Math.abs(this.score.protoss - this.score.zerg) > 3
			) {
				this.goToResults('protoss')
				this.totalGame.protoss++
			} else if (
				//taldarim
				this.score.protoss > this.score.zerg &&
				this.score.protoss > this.score.terran &&
				this.score.taldarim == 5
			) {
				this.goToResults('taldarim')
				this.totalGame.taldarim++
			} else if (
				//terran
				this.score.terran > this.score.zerg &&
				this.score.terran > this.score.protoss
			) {
				this.goToResults('terran')
				this.totalGame.terran++
			} else if (
				//hybrid
				Math.abs(this.score.protoss - this.score.zerg) <= 3
			) {
				this.goToResults('hybrid')
				this.totalGame.hybrid++
			} else {
				//infested
				this.goToResults('infested')
				this.totalGame.infested++
			}
			localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame))
		},
	},
	computed: {
		totalScore() {
			let score = 0
			for (let i in this.totalGame) {
				score += this.totalGame[i] * results[i].points
			}
			return score
		},
		openlRace() {
			let count = 0
			for (let i in this.totalGame) {
				if (this.totalGame[i] > 0) {
					count++
				}
			}
			return count
		},
		favoriteRice() {
			let max = 'zerg'
			for (let i in this.totalGame) {
				if (this.totalGame[i] > this.totalGame[max]) {
					max = i
				}
			}
			return results[max].name
		},
		showResultRace() {
			return {
				zerg: this.totalGame.zerg > 0 ? true : false,
				primal: this.totalGame.primal > 0 ? true : false,
				protoss: this.totalGame.protoss > 0 ? true : false,
				taldarim: this.totalGame.taldarim > 0 ? true : false,
				terran: this.totalGame.terran > 0 ? true : false,
				infested: this.totalGame.infested > 0 ? true : false,
				hybrid: this.totalGame.hybrid > 0 ? true : false,
			}
		},
	},
})

let audio = new Audio('audio/soundtrack.mp3')
let audio_btn = document.querySelector('.btn-sound')
let audio_icon = document.querySelector('.btn-sound i')

audio.muted = true
audio.autoplay = true
audio.volume = 0.2

audio_btn.addEventListener('click', function () {
	if (audio.muted) {
		audio.muted = false
		audio_icon.classList.add('fa-volume-up')
		audio_icon.classList.remove('fa-volume-off')
	} else if (!audio.muted) {
		audio.muted = true
		audio_icon.classList.remove('fa-volume-up')
		audio_icon.classList.add('fa-volume-off')
	}
})
