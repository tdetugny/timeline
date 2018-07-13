import props from "./models/props";
import { CENTER_CHANGE_DONE_EVENT } from "./constants";

type Multiplier = .25 | .5 | 1 | 2 | 4 | 8 | 16
const multipliers: Multiplier[] = [.25, .5, 1, 2, 4, 8, 16]

export default class Animator {
	private interval = .00001
	private multiplier: Multiplier = 1
	private animating = false
	private direction: -1 | 1 = 1
	private prevTimestamp: number

	private animate = (timestamp) => {
		// TODO find out why timestamp can be 0
		if (timestamp - this.prevTimestamp > 0) {
			props.center = props.center + (this.interval * this.multiplier * this.direction)
			document.dispatchEvent(new CustomEvent(CENTER_CHANGE_DONE_EVENT))
		}

		if (this.animating && props.center > 0 && props.center < 1) {
			this.prevTimestamp = timestamp
			requestAnimationFrame(this.animate)
		}
	}

	accelerate(): number {
		const index = multipliers.indexOf(this.multiplier)
		if (index === multipliers.length - 1) return multipliers[multipliers.length - 1]
		this.multiplier = multipliers[index + 1]
		return this.multiplier
	}

	decelerate(): number {
		const index = multipliers.indexOf(this.multiplier)
		if (index === 0) return multipliers[0]
		this.multiplier = multipliers[index - 1]
		return this.multiplier
	}

	isPlaying() {
		return this.animating
	}

	isPlayingForward() {
		return this.animating && this.direction === 1
	}

	isPlayingBackward() {
		return this.animating && this.direction === -1
	}

	play() {
		this.animating = true
		requestAnimationFrame(this.animate)
	}

	playForward() {
		this.direction = 1
		this.play()
	}

	playBackward() {
		this.direction = -1
		this.play()
	}

	stop() {
		this.animating = false
	}

	toggle() {
		this.animating ? this.stop() : this.play()
	}
}