# RealtimeKit React UI Kit Samples

## Contents
1. [Introduction](#introduction)
2. [About This Repository](#about-this-repository)
3. [Setting Up the Project](#setting-up-the-project)
   - [Prerequisites](#prerequisites)
   - [Installation Steps](#installation-steps)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
RealtimeKit is a technology company specializing in real-time communication solutions. Our products are designed to enable seamless and efficient video interactions in various applications, ranging from virtual meetings to interactive live streaming. The offerings are known for their robust performance, scalability, and ease of integration.

## About This Repository
This repository consists of all the different ways in which you can use RealtimeKit's
React UI Kit and other packages to its full extent to get the best live
audio/video experience.

## Samples

Here are the list of available samples at the moment.

1. [Default Meeting UI](./samples/default-meeting-ui/)
2. [Using Background Transformer to modify your background](./samples/with-background-transformer/)
3. [Audio Room](./samples/audio-room/)
4. [Facetime](./samples/facetime/)
5. [Chat](./samples/chat/)
6. [Live Auction App](./samples/live-auction/)

## Usage

To use these samples you would need to do the following steps:

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by going to https://docs.realtime.cloudflare.com/api?v=v2 and run the APIs in the
API runner itself so you can quickly get started.

Make sure you've created your RealtimeKit account at https://dev.realtime.cloudflare.com and have your
`Organization ID` and `API Key` ready to use from the
[API Keys section](https://dev.realtime.cloudflare.com/apikeys).

1. Go to
   [Create Meeting API](https://docs.realtime.cloudflare.com/api/?v=v2#/operations/create_meeting)
   and add your credentials and run the API with your request body, note the
   `id` you receive in resonse, this is the meeting id.
2. Go to
   [Add Participant API](https://docs.realtime.cloudflare.com/api/?v=v2#/operations/add_participant)
   and add a participant to the meeting with the `meetingId` you received in
   previous API call.

Once you're done, you'll get an `authToken`, which you can use in a sample as
explained below.

### Trying out a sample

Here are steps to try out the samples:

1. Clone the repo:

```sh
git clone git@github.com:dyte-io/react-samples.git
```

2. Change directory to the sample you want to try, for example: in
   `default-meeting-ui`:

```sh
cd samples/default-meeting-ui
```

3. Install the packages with your preferred package manager and start a
   development server and open up the page.

```sh
npm install
# and to start a dev server
npm run dev
```

4. Load the dev server in your browser and make sure you pass the `authToken`
   query in the URL.

```
http://localhost:5173/?authToken=<your-token>
```
