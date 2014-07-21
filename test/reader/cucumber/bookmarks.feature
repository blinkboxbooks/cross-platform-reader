@dev @bookmarks
Feature: Adding bookmarks
  As a reader
  I want to be able to bookmark any page of the book I'm reading

  @CR-300
  Scenario: Issue with bookmarking in large TOC of book 9781844037162
    Given I open book with the ISBN of 9781844037162
    When I go to chapter 3 page 2
    Then I want to bookmark the current page