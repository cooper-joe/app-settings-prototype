type FormatCountDownFn = (countdownInSeconds: number) => {
    minutes: string
    seconds: string
}

const formatCountdown: FormatCountDownFn = (countdownInSeconds) => {
    const minutes = Math.floor(countdownInSeconds / 60)
    const seconds = countdownInSeconds - minutes * 60

    return {
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    }
}

export default formatCountdown
