module.exports = async function convertCurr(service, sum) {
    if (service.includes('🇸🇪')) {
        balance += ' SEK';
    } else if (service.includes('🇵🇹')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇷🇴')) {
        return [
            sum * 26.89,
            sum * 0.74
        ]
    } else if (service.includes('🇮🇹')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇵🇱')) {
        return [
            sum * 27.88,
            sum * 0.76
        ]
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        return [
            sum * 158.23,
            sum * 4.33
        ]
    } else if (service.includes('🇦🇺')) {
        return [
            sum * 87.89,
            sum * 2.40
        ]
    } else if (service.includes('🇧🇾')) {
        balance += ' BYN';
    } else if (service.includes('🇨🇦')) {
        balance += ` CAN`
    } else if (service.includes('🇰🇿')) {
        balance += ` KZT`;
    } else if (service.includes('🇪🇸')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇩🇪')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇨🇭')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇭🇷')) {
        return [
            sum * 17.60,
            sum * 0.48
        ]
    } else if (service.includes('🇦🇪')) {
        return [
            sum * 32.68,
            sum * 0.89
        ]
    } else if (service.includes('🇸🇰')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🗺')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇸🇮')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if (service.includes('🇫🇷')) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if ((service.includes('🇦🇹'))) {
        return [
            sum * 133,
            sum * 3.64
        ]
    } else if ((service.includes('🇧🇷'))) {
        return [
            sum * 15.07,
            sum * 0.50
        ]
    }
}