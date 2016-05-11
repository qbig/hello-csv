## Hello CSV

The backlog is as folows:

0. Read the file (sample.csv).
1. Parse the loaded csv.
2. For each line do transfomation for `first_name` and `last_name` into `full_name`, hence we'll have `full_name` for each line.
3. Send the transformed line via SMS. (see [helper.js](https://github.com/HOOQsters/hello-csv/blob/master/helper.js))
4. Log the SMS sending status result to S3. (see [helper.js](https://github.com/HOOQsters/hello-csv/blob/master/helper.js))

### Discussion

- What do you think about the [`naive()`](https://github.com/HOOQsters/hello-csv/blob/master/parse-callback.js#L11) function?

  **Ans**:

  - There is some minor syntax issue, as "index++" seems redundant in a for in loop
  - Overall we are heading to 'callback hell' here in this naive approach, as we have been relying solely on callback to handle async procedures, and when more we nested the callbacks the harder it gets to read and understand the code. Error handling is also awkward in this case.
  - Another issue is related to performance of "fs.readFile". Depending on the size of files we handle, it may or may not be an issue, because it read the whole file into memory before the processing, which is unnecessary. A better approach would be using stream API and read line by line and process through the file. So the memory consumption would be way less.
  - An observation is that we are only logging the status to S3 when sendSms failed with an error, which is different from backlog. So I change to sending to log regardless.

- Please take a peek at the [parse-async.js](https://github.com/HOOQsters/hello-csv/blob/master/parse-async.js), [parse-stream.js](https://github.com/HOOQsters/hello-csv/blob/master/parse-stream.js) and [parse-promise.js](https://github.com/HOOQsters/hello-csv/blob/master/parse-promise.js), then give your best gift to us! (Yes, sending us a [proper PR](https://help.github.com/articles/creating-a-pull-request/))

**Constraint**: Please use async API only e.g. `fs.readFile` **NOT** `fs.readFileSync` for reading files.

**Note**: The [`sendSms`](https://github.com/HOOQsters/hello-csv/blob/master/helper.js#L17) and [`logToS3`](https://github.com/HOOQsters/hello-csv/blob/master/helper.js#L29) have surprises, please deal with that.

Ah, yes, one last thing, please use http://jscs.info/ to make your code consistent.

Have fun!
