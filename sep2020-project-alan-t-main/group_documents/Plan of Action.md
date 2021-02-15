# Plan of Action T-Vibe

## Table of contents

- [Plan of Action T-Vibe](#plan-of-action-t-vibe)
  * [1. Introduction](#1-introduction)
  * [2. Objectives, assignment and deliverables](#2-objectives--assignment-and-deliverables)
    + [2.1. Reason for the assignment](#21-reason-for-the-assignment)
    + [2.2. The problem](#22-the-problem)
    + [2.3. Objectives](#23-objectives)
    + [2.4. Assignment](#24-assignment)
    + [2.5. Deliverables](#25-deliverables)
  * [3. Definition of done](#3-definition-of-done)
    + [3.1. Code Reviews](#31-code-reviews)
    + [3.2. Code conventions](#32-code-conventions)
    + [3.3. Testing](#33-testing)
    + [3.4. Documentation](#34-documentation)
  * [4. Process description](#4-process-description)
    + [4.1. Scrum Board](#41-scrum-board)
      - [4.1.1 Labels](#411-labels)
      - [4.1.2. Task flow](#412-task-flow)
    + [4.2. Ceremonies](#42-ceremonies)
      - [4.2.1. Sprint planning](#421-sprint-planning)
        * [4.2.2. Daily standup](#422-daily-standup)
        * [4.2.3. Sprint Retrospective](#423-sprint-retrospective)
          + [4.2.3.1. Person-oriented](#4231-person-oriented)
          + [4.2.3.2. Process oriented](#4232-process-oriented)
          + [4.2.3.3. For both person and process oriented](#4233-for-both-person-and-process-oriented)
        * [4.2.4. Sprint Review](#424-sprint-review)
  * [5. Project organisation](#5-project-organisation)
    + [5.1. Those involved in the project](#51-those-involved-in-the-project)
    + [5.2. Group rules](#52-group-rules)
      - [5.2.1. Work hours](#521-work-hours)
        * [5.2.1.1. Breaks](#5211-breaks)
      - [5.2.2. Calling in sick, coming in late and planned absences](#522-calling-in-sick--coming-in-late-and-planned-absences)
      - [5.2.3. Appointments and meetings](#523-appointments-and-meetings)
        * [5.2.3.1. Daily meetings](#5231-daily-meetings)
        * [5.2.3.2. Weekly meetings](#5232-weekly-meetings)
        * [5.2.3.3. Biweekly meetings](#5233-biweekly-meetings)
  * [6. Risk analysis](#6-risk-analysis)
  * [7. Sources and literature](#7-sources-and-literature)

## 1. Introduction

T-Vibe is a music platform, designed to both discover and share new music. 
It has integrations with popular music sites like YouTube, Spotify and SoundCloud so that you can listen to songs from any platform. You can create your own playlists filled with your favorite songs of your favorite artists and genres.
On T-Vibe you’ll not only listen to the world’s most popular songs, but you can also discover new and innovative music and upcoming artists.

This project is going to be done in Scrum, a well-known agile development method with multiple iterations where a project team can deliver interim results for each productpart and ultimately, deliver the product as a whole. 

First, we'll explain what our assignment is and what objectives and deliverables we have in this project.
This is described in the chapter ['Objectives, assignment and deliverables'](#2-objectives--assignment-and-deliverables).
Secondly, we'll explain the quality requirements of the deliverables, in the chapter ['Definition of done'](Definition%20Of%20Done.md).
Thirdly, we'll explain how we are going to handle the Scrum board- and ceremonies in this project, in the chapter ['Process description'](#4-process-description).
Then we'll explain how our project-group is organized and what Scrum role each team member has, in the chapter ['Project organisation'](#5-project-organisation).
At last we explain the risks that can occur in this project, in the chapter ['Risk analysation'](Risk%Analysis.md).

The goal of this project is to create a working prototype of the T-Vibe application with the captured user stories, as described in our Software Guidebook.

## 2. Objectives, assignment and deliverables

In this chapter, the reason for the project and assignment is first described and then the client's problem is recorded, in order to see which goals must be achieved to solve this problem. An assignment is drawn up based on those goals. The results needed to complete the assignment are then displayed.

### 2.1. Reason for the assignment

There was another assignment provided by the teacher, but the project team was not that fond about the given assignment. So the project team came up with a new assignment, which is T-Vibe, as described in the chapter ['Introduction'](#1-introduction).

### 2.2. The problem
When using music streaming services like Spotify, some people complain about missing features. Spotify for example does not know if a song exists sometimes. A lot of people use Spotify on their phone, laptop and computer, it is also their go-to-option when they are on their way somewhere. It can be very frustrating that when you find a song on YouTube or SoundCloud, and want to add it to one of your Spotify-playlists, and the song cannot be found on Spotify. We, as the project group, want to find a solution for this problem, so music from all kinds of streaming services can be listened to at one place, everytime and anywhere. 

### 2.3. Objectives
One of the goals of this project is to provide a solution to listen to songs of all kinds of music streaming services in one application.
Another goal is for users to be able to discover lesser-known artists, so that those artists can get some exposure and to widen the music experience of the user of this application. 
The third goal is to be able to track the data of each user. Like the top 10 artists, genres and songs of each user and sharing those data with their friends or followers. 

### 2.4. Assignment
An application needs to be developed to have the user listen to music of all kinds of music streaming services. There will also be a database to save all the needed information of the application, like songs, playlists, user information and user preferences. 
If needed, there will also be a transfer document, this acts like a user guide of the application. 

### 2.5. Deliverables
The deliverables for a client are summed up below:

* A database to save the needed information of the application. Like the songs, playlists and user information. This database will be created in MongoDB. 
* A web application where the user will be able to use the new music streaming service. The user will be able to create a playlist with songs from multiple music streaming services (Spotify, SoundCloud and YouTube). Obviously, the user will be able listen to the music in the playlists and also be able to track and share their top 10 songs, genres and artists. This web application will be created in ReactJS. 

To be able to get songs from different music streaming services, the team members of this project are required to do research on the REST API of each streaming service. In this case, the streaming services are YouTube, Spotify, SoundCloud. This will cost some time and research.

## 3. Definition of done

In this chapter, we describe the quality requirements for our documentation and code for this project. 
These quality requirements are split in four categories: Code Reviews, Code conventions, Testing and Documentation.

## 3.1. Code Reviews

* All pull-requests are reviewed by two persons
    * After the first reviewer has accepted it, the second will review it
        * Once the second reviewer has also accepted, the pull-request will be merged by the original author
        * If either reviewer rejects it, the author has to correct the mistakes and both reviewers will check again
* The reviewers may reject a pull-request if:
    * The pull-request is not linked to a task
    * The code does not compile and/or work
    * The code does not specifically do what was expected
        * E.g. the task was interpreted differently
    * There are merge conflicts
    * The code conventions (as specified below) are not sufficiently followed
    * The tests are not sufficient (as specified below)
    * The code contains either of the following:
        * Commented code
        * Debug code (e.g. console-logs or alerts)
        * Unused code, variables, functions or imports
    * The code documentation is not in the English language

-----

## 3.2. Code conventions

* For writing the code of our application, we use the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as a helping tool. 
* All code is written in the English language
* All user-defined functions and classes are complete with [JSDoc](https://jsdoc.app/)
* All user-defined functions, variables, classes, etc. have distinct, brief and clear names
    * E.g. variable 'a' is too short and thus unclear
    * E.g. variable 'genericObjectToBeAssignedInNextInteration' is too long
    * E.g. variable 'temporary' is unclear
* All files are placed in the right package/folder
    * E.g. API-routes are placed inside a 'routes' folder, or a 'routes'-subfolder

-----

## 3.3. Testing

* Only the server-side will be tested
* The server tests run on the main server.js file
* All significant functionalities are integration tested
* All significant parts of each functionality (unit tests) are tested, the happy- and alternative flows of each functionality
* Database-tests must be locally done in a test-database, database connection is called in the 'before'-function 
* End-to-end tests will be constructed with Puppeteer


-----

## 3.4. Documentation

* All documentation is written in the English language
* All documentation is accommodated with proper titles, headers and paragraphs
* All documentation is clear of grammar- or spelling-mistakes and typos

### 3.4.1. Software Guidebook

* The Software Guidebook meets all the default guidelines as given in the workshop 'Software Guidebook'
* The wireframes are written in the English language

## 4. Process description

In this project, we use the agile development method 'Scrum'. 
In this chapter, we will explain how we use our Scrum board throughout the project and how we will handle each Scrum ceremony in a proper way. 

### 4.1. Scrum Board

Our Scrum Board for this project consists of 6 columns.
Some of these columns are default columns that are used in every Scrum Project. The ones that may not be clear, are explained below:

* To do
* Needs work 
    * After a pull request is rejected, the task connected to the pull-request (feedback of the pull-request) needs to implement feedback of the reviewer. When the one responsible for the given task is too busy to work on the feedback, the task goes to ‘Needs work’.
* In progress
* To review
    * When other team members don't have the time to review the task that a team member has done, the task will be placed in this column. 
* In review
    * When another team member has the time to review the task that a team member has done and is currently reviewing the task, the task will be placed in this column. 
* Done

The updated Sprint Backlog can be found in the [Software Guidebook](../documentation/SoftwareGuidebook.md).

#### 4.1.1 Labels
In the Scrum Board, we use labels to specify which task belongs to. For example, a certain document like the Software Guidebook, an Research or a User Story. We have two sorts of labels: general labels and project-specific labels.

* General labels
    * Epic 
    * User Story
    * Bug
    * Subtask
* Project-specific
    * Documentation
    * Plan of action
    * Software Guidebook
    * Research
    * GUI
    * Server

#### 4.1.2. Task flow

These flows below describe how the process of a task goes from start to end. 

**Happy flow**

This is the happy flow of each task.

```To do => In progress => To review => In review => Done```

**Review rejected**

This is a scenario when a review from a team member is rejected. 
In this case, the task from 'In review' will go to 'Needs work'.
When the team member who implements the task has time to implement the feedback, the task will go to 'In progress',
where hopefully the proces can go like the happy flow. If not, repeat the cycle 'In review' -> 'Needs work'.

```To do => (In progress => To review => In review => (Needs work => In progress)) => Done```

### 4.2. Ceremonies

#### 4.2.1. Sprint planning

* Name all the absentees and the reasons for their absence.
* The team members and Product Owner are required to attend this meeting. 
* The Product Owner sets the main goal in the sprint, then the team members and Product Owner map some of the remaining user-stories related to the main goal to the Scrum board. 
* Determine and specify the sub-tasks of each user-story, by filling in the description and labelling the tasks. 
* Record hours per sub-task in the sprint, by playing the so-called ‘schedule poker’.
* Start the sprint.

##### 4.2.2. Daily standup

* Welcome everyone.
    * Name the absentee(s) and the reason(s) for their absence

* Meeting (Scrum) leader starts the round
    * Elaborate what you did the day before
    * Name any bottlenecks you’ve encountered
    * Ask for assistance if needed
    * Explain what you will be doing today
    * Name the (sub-)task/user story on Github specifically
    * Try to give a time indication
    * Other questions or remarks

* Meeting leader states the meetings of the day
    * Every other week:
      As meeting leader, ask every member:
        * If he thinks we can make the current sprint
        * How motivated he is

If there are no further questions, the meeting leader closes the DSU appropriately

##### 4.2.3. Sprint Retrospective

* Name all the absentees(s) and the reason(s) for their absence

###### 4.2.3.1. Person-oriented

* For each person on whom feedback is given
    * 1 top and 1 (or more) tips
    * What else did you notice?
    * Questions / remarks 

###### 4.2.3.2. Process oriented

* What went well in the process?
    * Which points should we stick to?
    * Questions or remarks
* What went wrong in the process? 
    * What can be improved next time?
    * Questions or remarks
* Make a plan for implementing the feedback of the past process for the next iteration, if needed. 

###### 4.2.3.3. For both person and process oriented

* Adjust relevant documents if necessary

##### 4.2.4. Sprint Review

* Name all the absentees(s) and the reason(s) for their absence.
The team members, Product Owner and other stakeholders are required to attend this meeting. 
* The team members give an overview and evaluation what tasks of the past Sprint Backlog are done and what isn’t. 
* The team members explain what went well in the past Sprint and what didn’t, using the Process evaluation of the Sprint Retrospective. The team    members are also required to provide solutions to the stakeholders and Product Owner, when there are points of improvement in the Process evaluation. 
* The team members give a demonstration of the implemented features of the past Sprint and answers the questions of the stakeholders and Product Owner.
* The Product Owner gives his evaluation of the past Sprint and provides further feedback if necessary. 

## 5. Project organisation

This chapter establishes which stakeholders are involved in this project and when agreements between the development team and other stakeholders will take place.

### 5.1. Those involved in the project

In addition to the development team, the following stakeholders are involved in this project, below, in Table 1, Contact details stakeholders, the contact details of the stakeholders can be seen.

|Name   |Email   |Phone-number   |Role   |
|---|---|---|---|
|Bart van der Wal   |Bart.vanderWal@han.nl    |0627081476   |Client / Product Owner   |
|Robert Holwerda    |Robert.Holwerda@han.nl   |0616966913   |Coach   |

The coach is contacted at least once a week. The course of events is discussed and feedback is requested.
The Product Owner will be contacted per Sprint / iteration.
Below, in Table 3, Planning contact with client, it is stated when and for what purpose contact with the client will be contacted:

|Iteration / Sprint   |Expected date   |Reason   |
|---|---|---|
|PreGame    |10 november 2020     |Discuss alternative assignment of the project with the client for approval and feedback.   |
|Sprint 1   |N/A   |Present research results and first version of the Action Plan (plan van aanpak) + Software Guidebook to the client and coach. Change any Quality Attribute Requirements based on the Sprint Review.   |
|Sprint 2   |N/A   |Presenting functionalities built during Sprint 1 to the client. Change any Quality Attribute Requirements  based on feedback during the Sprint Review.    |
|Sprint 3   |N/A   |Presenting functionalities built during Sprint 2 to the client. Change any Quality Attribute Requirements based on feedback during the Sprint Review.    |
|PostGame   |N/A   |Presenting functionalities built during Sprint 3 to the client. Change any Quality Attribute Requirements based on feedback during the Sprint Review.    |
|Deliver made products   |N/A   |Deliver database and application to the client.   |

The dates of the interviews may differ and are therefore not yet recorded in this document. When agreements have been made in the future, the table will be updated. 

The project team consists of four students. Below in Table 4, Contact details project group, you will find the contact details of the team members:

|Name   |Email   |Phone-number   |Role   |
|---|---|---|---|
|Ruben Pruijssers   |ruben.pruijssers@gmail.com, RC.Pruijssers@student.han.nl   |0681141743   |Product Owner (by proxy), team member   |
|Pepijn van Erp   |pepijnvanerp98@outlook.com, PPB.vanerp@student.han.nl   |0624826358   |Team member   |
|Diégo Cup   |diegocup@gmail.com, DD.Cup@student.han.nl   |0641300266   |Team member   |
|Vu Le   |vu1998le12@gmail.com, HV.Le@student.han.nl   |0685593712   |Team member   |

There are also roles for the group members. The following roles apply to each group member: 

* Product Owner (by proxy)
* Scrum Master
* Team member 
* Note taker 

The Scrum Master role is changed every iteration, so that every student contributes equally to the Scrum-process. Below, in Table 5, Distribution of the role of Scrum Master, it is specified in which iteration each student has the role of Scrum Master:

|Iteration   |Name   |Role   |
|---|---|---|
|PreGame + PostGame   |Ruben Pruijssens   |Scrum Master   |
|   |Pepijn van Erp   |Note taker   |
|Sprint 1   |Vu Le   |Scrum Master   |
|   |Diégo Cup   |Note taker   |
|Sprint 2   |Pepijn van Erp   |Scrum Master  |
|   |Vu Le  |Note taker   |
|Sprint 3   |Diégo Cup  |Scrum Master   |
|   |Ruben Pruijssens   |Note taker   |

### 5.2. Group rules

#### 5.2.1. Work hours

Monday through friday eight hours a day:

Start 09:15 (time of stand-up) at latest.
End eight hours after start, including breaks, and at the earliest after the stand-down at 16:00. E.g. 08:30-16:30 or 09:15-17:15.

##### 5.2.1.1. Breaks

* Lunch
    * At your own time
    * Max 30 minutes
* Small breaks (coffee, smoking, etc.)
    * Max 30 minutes in total per day
    
#### 5.2.2. Calling in sick, coming in late and planned absences

When taken ill, notify the team as early as possible, and at latest at the start of the daily stand-up (09:15).
When taken ill for a longer amount of time, check in daily and if deemed necessary the teachers will be notified.

Coming in late (e.g. oversleeping) for more than 5 minutes will be noted in the absence-document and after three times the teachers will be notified.

Planned absences (e.g. dentist or doctor appointments) should be called in at least 24 hours on forehand and should be noted in both the calendar and the absence-document.

#### 5.2.3. Appointments and meetings

There are several meetings repeating daily, weekly and biweekly.

* All meeting-agenda's are pushed to GitHub at the end of the week, in a feature-branch called 'feature/meetings'.

##### 5.2.3.1. Daily meetings

* Daily stand-up
    * Time: 09:15
    * Duration: Approximately 15 minutes
    * Present: The development team
    * Goal: Get a rough idea what everyone will be working on that day
* Daily stand-down
    * Time: 16:00
    * Duration: Approximately 15 minutes
    * Present: The development team
    * Goal: Get and idea of what has been done that day and what people are still struggling with

##### 5.2.3.2. Weekly meetings

* Coach meeting
    * Day: Tuesdays
    * Time: 09:30
    * Duration: Up to one hour
    * Present: The development team, coach Robert Holwerda
    * Goal: Give updates to Robert and discuss school-related information
    
##### 5.2.3.3. Biweekly meetings

* Sprint planning
    * Day: T.b.d. (at the start of the sprint)
    * Time: T.b.d.
    * Duration: Up to two hours
    * Present: The development team, product owner Bart van der Wal
    * Goal: Plan the upcoming sprint and decide which user stories will be taken to the sprint backlog
* Retrospective
    * Day: T.b.d. (at the end of the sprint)
    * Time: T.b.d.
    * Duration: Up to one hour
    * Present: The development team, coach Robert Holwerda
    * Goal: Look back on the sprint and review how it went
* Sprint review
    * Day: T.b.d. (at the end of the sprint)
    * Time: T.b.d.
    * Duration: Up to two hours
    * Present: The development team, product owner Bart van der Wal
    * Goal: Present the progress and deliverables to the product owner
* Progress meeting
    * Day: T.b.d. (at halfway-point of the sprint)
    * Time: T.b.d.
    * Duration: Up to one hour
    * Present: The development team
    * Goal: Review the current sprint and if deemed necessary adjust course

## 6. Risk analysis

In this chapter, we will explain the potential risks in this project. 
We will discuss the probability, impact and an eventual fallback strategy for each risk. 

| Risk | Probability | Impact | Fallback Strategy |
|------|------|---------|-----------|
| API access is too limited | Medium | High | More commitment to other streaming service API's |

## 7. Sources and literature

Scrum sprint planning (+ template) | Scrumguide.nl. (2020, 6 april). Scrumguide. https://scrumguide.nl/sprint-planning/

Sprint retrospective | Scrumguide.nl. (2020, 6 april). Scrumguide. https://scrumguide.nl/retrospective-scrum/
