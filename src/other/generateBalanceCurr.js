module.exports = function generateBalanceCurr(service, balance) {
    if (balance.length == 0) balance = `0`

    if (service.includes('🇸🇪')) {
        balance += ' SEK';
    } else if (service.includes('🇵🇹')) {
        balance += ' EUR';
    } else if (service.includes('🇷🇴')) {
        balance += ' RON';
    } else if (service.includes('🇮🇹')) {
        balance += ' EUR';
    } else if (service.includes('🇵🇱')) {
        balance += ' PLN';
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        balance += ' GBP';
    } else if (service.includes('🇦🇺')) {
        balance += ' AUD';
    } else if (service.includes('🇧🇾')) {
        balance += ' BYN';
    } else if (service.includes('🇨🇦')) {
        balance += ` CAN`
    } else if (service.includes('🇰🇿')) {
        balance += ` KZT`;
    } else if (service.includes('🇪🇸')) {
        balance += ' EUR'
    } else if (service.includes('🇩🇪')) {
        balance += ' EUR'
    } else if (service.includes('🇨🇭')) {
        balance += ' EUR'
    } else if (service.includes('🇭🇷')) {
        balance += ' HRK'
    } else if (service.includes('🇦🇪')) {
        balance += ' AED'
    } else if (service.includes('🇸🇰')) {
        balance += ' EUR'
    } else if (service.includes('🗺')) {
        balance += ' EUR'
    } else if (service.includes('🇸🇮')) {
        balance += ' EUR'
    } else if (service.includes('🇫🇷')) {
        balance += ' EUR'
    } else if (service.includes('🇦🇹')) {
        balance += ' EUR'
    } else if (service.includes('🇧🇷')) {
        balance += ' $R'
    }

    return balance
}