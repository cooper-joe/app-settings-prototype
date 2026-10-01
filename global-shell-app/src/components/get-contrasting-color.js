import { calcAPCA } from 'apca-w3'

const getConstrastingColor = (color) => {
    if (!color) {
        return
    }

    const apcaBlack = Math.abs(calcAPCA('black', color))
    const apcaWhite = Math.abs(calcAPCA('white', color))

    if (apcaBlack > apcaWhite) {
        return 'black'
    }
    return 'white'
}

export default getConstrastingColor
