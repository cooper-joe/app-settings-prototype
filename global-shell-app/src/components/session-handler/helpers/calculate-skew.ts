const calculateSkew = (serverTime: number) => {
    const clientTime = Date.now()
    const clientDiffWithServer = clientTime - serverTime

    return clientDiffWithServer
}

export default calculateSkew
