// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
        cy.get('input[name="username"]').type(username)
        cy.get('input[name="password"]').type(password)
        cy.get('input[value="Log In"]').click()
})

Cypress.Commands.add('logout', () => {    
    cy.contains('Log Out').click()
})

Cypress.Commands.add('openNewAccount', (accountType) => {
    cy.contains('Open New Account').click()
    cy.get('#type').select(accountType)
    cy.get('#fromAccountId').select(Cypress.env('baseAccount'))
    cy.get('input[value="Open New Account"]').click()
    cy.get('h1').should('have.text', 'Account Opened!')
        .next('p').should('have.text', 'Congratulations, your account is now open.')
        .next('p').within(($form) => {
            let accountId = $form.find('#newAccountId').text()
            Cypress.env('newAccountId', accountId)
            let newAccountText = `Your new account number: ${accountId}`
            expect($form.text()).to.eq(newAccountText)
            return cy.wrap(accountId)                       
        })               
})

Cypress.Commands.add('fillBillPayForm', (element, value) => {
    cy.get('.form2').find(`input[name="${element}"]`).type(value)
})

Cypress.Commands.add('doBillPay', (fromAccount, toAccount, payeeName, amount) => {

    const formData = {
        'payee.name': payeeName,
        'payee.address.street': 'test',
        'payee.address.city': 'test',
        'payee.address.state': 'test',
        'payee.address.zipCode': 'test',
        'payee.phoneNumber': '1234567890',
        'payee.accountNumber': toAccount,
        'verifyAccount': toAccount,
        'amount': amount
    }

    cy.contains('Bill Pay').click()
    Object.keys(formData).forEach(valuePair => {
        cy.fillBillPayForm(valuePair, formData[valuePair])
    })
    cy.get('select[name="fromAccountId"]').select(fromAccount)
    cy.get('input[value="Send Payment"]').click()
})