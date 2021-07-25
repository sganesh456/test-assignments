/// <reference types="Cypress" />

const USERNAME = Cypress.env('username')
const PASSWORD = Cypress.env('password')

context('Verify Account Creation', () => {
    
    let accountId;

    beforeEach(() => {
        cy.visit('/index.htm')
        cy.login(USERNAME, PASSWORD)
    })

    it.skip('Verification of opening a checking account', () => {               
        cy.openNewAccount('CHECKING')
        cy.get('#newAccountId').click()            
    })

    it.skip('Verification of opening a savings account', () => {               
        cy.openNewAccount('SAVINGS')
        cy.get('#newAccountId').click()            
    })

    it.skip('Verification of account details page', () => {
        let values = [];
        const ACCOUNT_TYPE = 'SAVINGS'

        cy.openNewAccount(ACCOUNT_TYPE).then(($el) => {
            accountId = $el.find('a').text()            
        })        
        cy.get('#newAccountId').click()
        cy.wait(3000)
        cy.contains('Account Details').next().find('tr').each(($el) => {
            cy.wrap($el).invoke('text').then(text => {
                values.push(text.replace(/\s+(?=\s)/g, '').trim())
            })
        }).then(() => {
            expect(values).to.deep.eq([`Account Number: ${accountId}`, `Account Type: ${ACCOUNT_TYPE}`, 'Balance: $100.00', 'Available: $100.00'])
        })
    })

    it('Verification of Bill Pay section', () => {
        const formData = {
            'payee.name': 'test',
            'payee.address.street': 'test',
            'payee.address.city': 'test',
            'payee.address.state': 'test',
            'payee.address.zipCode': 'test',
            'payee.phoneNumber': '1234567890',
            'payee.accountNumber': '13040',
            'verifyAccount': '13040',
            'amount': '200.00'
        }

        cy.contains('Bill Pay').click()
        Object.keys(formData).forEach(valuePair => {
            cy.fillBillPayForm(valuePair, formData[valuePair])
        })
        cy.get('input[value="Send Payment"]').click()
    })

    afterEach(() => {
        cy.logout()
    })
})