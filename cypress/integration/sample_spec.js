// The user MUST be enrolled as teacher in at least 1 course
const MOODLE_API_ENDPOINT = 'http://localhost:80/moodle/';
const MOODLE_USERNAME = 'teacher';
const MOODLE_PASSWORD = 'teacher';

const GRAASP_URL = 'http://localhost:3000/';
const APP_INSTANCE_ID = '6156e70ab253020033364411';
const GRAASP_TEACHER_APP_URL = `${GRAASP_URL}?spaceId=5b56e70ab253020033364411&appInstanceId=${APP_INSTANCE_ID}&mode=teacher&userId=5b56e70ab253020033364416&dev=true`;

describe('Import Data from Moodle', () => {
  it('Open the Graasp App', () => {
    cy.visit(GRAASP_TEACHER_APP_URL);
    cy.contains('No data imported yet');
  });

  it('Establish a Connection', () => {
    cy.get('button[aria-label="Settings"]').click();
    cy.get('#establishConnection').as('establishConnectionButton');

    // Check when fields are empty
    cy.get('#moodleApiEndpoint').clear();
    cy.get('#moodleUsername').clear();
    cy.get('#moodlePassword').clear();
    cy.get('@establishConnectionButton').contains('Establish Connection');
    cy.get('@establishConnectionButton').should('be.disabled');

    // Establish the connection
    cy.get('#moodleApiEndpoint').type(MOODLE_API_ENDPOINT);
    cy.get('#moodleUsername').type(MOODLE_USERNAME);
    cy.get('#moodlePassword').type(MOODLE_PASSWORD);
    cy.get('@establishConnectionButton').should('not.be.disabled');
    cy.get('@establishConnectionButton').click();
    cy.get('@establishConnectionButton').contains('Connection Established');
  });

  it('Import a Course', () => {
    cy.contains('Select Course to Import');
    cy.get('#moodleImportCourse').as('moodleImportCourseButton');
    cy.get('@moodleImportCourseButton').should('be.disabled');

    // Select the first available course and import it
    cy.get('#moodleCourseSelection').click();
    cy.focused().type('{downArrow}{enter}', { force: true });
    cy.get('@moodleImportCourseButton').should('not.be.disabled');
    cy.get('@moodleImportCourseButton').click();
    cy.contains('created'); // specific action type used at least once when "creating" a moodle course
  });

  it('Filter Imported Data', () => {
    cy.get('#filter-target').as('targetFilter');
    cy.get('table:last').as('dataTable');
    cy.get('@dataTable')
      .find('tr')
      .its('length')
      .then($initialLength => {
        cy.get('@targetFilter').click();
        cy.get('@targetFilter').type('course');
        cy.focused().type('{downArrow}{enter}', { force: true });
        cy.get('@dataTable')
          .find('tr')
          .its('length')
          .then($filteredLength => {
            expect($initialLength).to.be.greaterThan($filteredLength);
          });
      });
  });

  it('Saves the Imported Data as App Instance Resource', () => {
    cy.get('#saveRawAsAppInstanceResourceButton').click();
    cy.get('table')
      .find('td')
      .contains(APP_INSTANCE_ID)
      .next()
      .contains(MOODLE_API_ENDPOINT);
  });
});
