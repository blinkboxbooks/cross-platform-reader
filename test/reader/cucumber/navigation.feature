@dev @navigation
Feature: Navigating books
  I expect to be able to navigate throughout the book.

  @CR-354
  Scenario: Issue when parsing links
    Given I open book with the ISBN of 9781118044025
    When I go to chapter 2 page 0
    And I click "Title"
    Then I expect to be on chapter 1