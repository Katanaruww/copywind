module.exports = function(service) {
    if (service.includes('🇸🇪')) {
        curr = 'SEK'
    } else if (service.includes('🇵🇹')) {
        curr = 'EUR'
    } else if (service.includes('🇷🇴')) {
        curr = 'RON'
    } else if (service.includes('🇮🇹')) {
        curr = 'EUR'
    } else if (service.includes('🇵🇱')) {
        curr = 'PLN'
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        curr = 'GBP'
    } else if (service.includes('🇦🇺')) {
        curr = 'AUD'
    } else if (service.includes('🇧🇾')) {
        curr = 'BYN'
    } else if (service.includes('🇨🇦')) {
        curr = `CAN`
    } else if (service.includes('🇰🇿')) {
        curr = `KZT`
    } else if (service.includes('🇪🇸')) {
        curr = 'EUR'
    } else if (service.includes('🇩🇪')) {
        curr = 'EUR'
    } else if (service.includes('🇨🇭')) {
        curr = 'CHF'
    } else if (service.includes('🇭🇷')) {
        curr = 'HRK'
    } else if (service.includes('🇫🇷')) {
        curr = 'EUR'
    } else if (service.includes('🇦🇪')) {
        curr = 'AED'
    } else if (service.includes('🇸🇰')) {
        curr = 'EUR'
    } else if (service.includes('🗺')) {
        curr = 'EUR'
    } else if (service.includes('🇸🇮')) {
        curr = 'EUR'
    } else if (service.includes('🇦🇹')) {
        curr = 'EUR'
    } else if (service.includes('🇧🇷')) {
        curr = '$R'
    }

    return curr
}