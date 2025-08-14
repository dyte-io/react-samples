# Back to Back Meetings

A sample that demonstrates switching between two meetings sequentially. Only one meeting is displayed at a time, with the ability to leave the current meeting and join the next one using different auth tokens.

## Features

- Single meeting display (not parallel)
- Two auth tokens for different meetings
- Leave meeting functionality using rtk-leave-meeting
- Join next meeting button that appears after leaving
- Listens to meeting.self.on('roomLeft') to manage UI state

## Usage

Pass two auth tokens via URL parameters:
```
?authToken1=<first-meeting-token>&authToken2=<second-meeting-token>
```
