@dev @navigation
Feature: Navigating books
  I expect to be able to navigate throughout the book.

  @CR-354
  Scenario: Issue when parsing links
    Given I open book with the ISBN of 9781118044025
    When I go to chapter 2 page 0
    And I click "Title"
    Then I expect to be on chapter 1

  @CR-354
    Scenario: Issue when parsing links
      Given I open a book
      When I go to chapter 2 page 0
      And I click "Dedication"
      Then I expect to be on chapter 3

	@CR-383
		Scenario: Issue generating CFI in book 9780718192952
			Given I open book with the ISBN of 9780718192952
			When I go to chapter 9 page 0
    	Then I want to bookmark the current page