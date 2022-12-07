# Dyte React Samples

This repository consists of all the different ways in which you can use Dyte's
React UI Kit and other packages to its full extent to get the best live audio/video
experience.

## Samples

Here are the list of available samples at the moment.

1. [Default Meeting UI](./samples/default-meeting-ui/)
2. [Using Background Transformer to modify your background](./samples/with-background-transformer/)

## Usage

To use these samples you would need to do the following steps:

1. Create a meeting, add a participant with our APIs
2. Use that `authToken` you receive in a sample by passing it in the URL query: `http://localhost:5173/?authToken=<your-token>`

### Trying out a sample

Here are steps to try out the samples:

1. Clone the repo:

```sh
git clone git@github.com:dyte-io/react-samples.git
```

2. Change directory to the sample you want to try, for example: in `default-meeting-ui`:

```sh
cd samples/default-meeting-ui
```

3. Install the packages with your preferred package manager and start a development server and open up the page.

```sh
npm install
# and to start a dev server
npm run dev
```

4. Load the dev server in your browser and make sure you pass the `authToken` query in the URL.

```
http://localhost:5173/?authToken=<your-token>
```
