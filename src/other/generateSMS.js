module.exports = function generateText(code, type, selection, link) {
    if ((code == 'DE') && (type == '1.0') && (selection == 'Default')) {
        return `Bestätige den Kauf: ${link}`
    } else if ((code == 'DE') && (type == '2.0') && (selection == 'Default')) {
        return `Erhalten Sie Geld für den Verkauf: ${link}`
    } else if ((code == 'DE') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Bestätigen Sie Ihre Reise: ${link}`
    } else if ((code == 'DE') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Geld von einem Passagier erhalten: ${link}`
    } 
    
    if ((code == 'PL') && (type == '1.0') && (selection == 'Default')) {
        return `Potwierdzić zamówienie: ${link}`
    } else if ((code == 'PL') && (type == '2.0') && (selection == 'Default')) {
        return `Nowa sprzedaż: ${link}`
    } else if ((code == 'PL') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Potwierdź swoją podróż: ${link}`
    } else if ((code == 'PL') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Odbierz pieniądze od pasażera: ${link}`
    }

    if ((code == 'RO') && (type == '1.0') && (selection == 'Default')) {
        return `Confirma achiziția: ${link}`
    } else if ((code == 'RO') && (type == '2.0') && (selection == 'Default')) {
        return `Primiți fonduri pentru vânzare: ${link}`
    } else if ((code == 'RO') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Confirmați călătoria: ${link}`
    } else if ((code == 'RO') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Primiți bani de la un pasager: ${link}`
    }

    if ((code == 'ES') && (type == '1.0') && (selection == 'Default')) {
        return `Confirma el pedido: ${link}`
    } else if ((code == 'ES') && (type == '2.0') && (selection == 'Default')) {
        return `Venta nueva: ${link}`
    } else if ((code == 'ES') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Confirma tu viaje: ${link}`
    } else if ((code == 'ES') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Reciba dinero de un pasajero: ${link}`
    }


    if ((code == 'IT') && (type == '1.0') && (selection == 'Default')) {
        return `Confermare l'acquisto: ${link}`
    } else if ((code == 'IT') && (type == '2.0') && (selection == 'Default')) {
        return `Ricevi fondi per la vendita: ${link}`
    } else if ((code == 'IT') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Conferma il tuo viaggio: ${link}`
    } else if ((code == 'IT') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Ricevi denaro da un passeggero: ${link}`
    }

    if ((code == 'FR') && (type == '1.0') && (selection == 'Default')) {
        return `Confirmer l'achat: ${link}`
    } else if ((code == 'FR') && (type == '2.0') && (selection == 'Default')) {
        return `Recevoir des fonds pour la vente: ${link}`
    } else if ((code == 'FR') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Confirmez votre voyage: ${link}`
    } else if ((code == 'FR') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Recevoir de l'argent d'un passager: ${link}`
    }

    if ((code == 'PT') && (type == '1.0') && (selection == 'Default')) {
        return `Confirme a compra: ${link}`
    } else if ((code == 'PT') && (type == '2.0') && (selection == 'Default')) {
        return `Receba fundos pela venda: ${link}`
    } else if ((code == 'PT') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Confirme sua viagem: ${link}`
    } else if ((code == 'PT') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Receba dinheiro de um passageiro: ${link}`
    }

    if ((code == 'AU') && (type == '1.0') && (selection == 'Default')) {
        return `Confirm order: ${link}`
    } else if ((code == 'AU') && (type == '2.0') && (selection == 'Default')) {
        return `Receive funds for the sale: ${link}`
    } else if ((code == 'AU') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Confirm your trip: ${link}`
    } else if ((code == 'AU') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Receive money from a passenger: ${link}`
    }

    if ((code == 'UK') && (type == '1.0') && (selection == 'Default')) {
        return `Confirm order: ${link}`
    } else if ((code == 'UK') && (type == '2.0') && (selection == 'Default')) {
        return `Receive funds for the sale: ${link}`
    } else if ((code == 'UK') && (type == '1.0') && (selection == 'BlaBlaCar')) {
        return `Confirm your trip: ${link}`
    } else if ((code == 'UK') && (type == '2.0') && (selection == 'BlaBlaCar')) {
        return `Receive money from a passenger: ${link}`
    }
}