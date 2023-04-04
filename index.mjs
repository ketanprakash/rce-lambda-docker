import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import os from "os";
const tmpDir = os.tmpdir();
import generateFileName from "./helpers/generateName.mjs";
import util from "util";
const execAsync = util.promisify(exec);

async function exeC(event) {
  try {
    const fileName = await generateFileName();
    const { code, input = "" } = JSON.parse(event["body"]);

    const codePath = path.join(tmpDir, fileName + ".cpp");
    const exePath = path.join(tmpDir, fileName + ".exe");
    const inputPath = path.join(tmpDir, fileName + ".txt");

    await fs.writeFile(codePath, code, function (err) {
      if (err) throw err;
    });
    await fs.writeFile(inputPath, input, function (err) {
      if (err) throw err;
    });

    await execAsync(`gcc ${codePath} -o ${exePath}`);
    const startTime = new Date().getTime();
    const { error, stdout, stderr } = await execAsync(
      `${exePath} < ${inputPath}`,
      { timeout: 4000 }
    ).catch((error) => {
      throw error;
    });
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;

    const output = error || stderr || stdout;
    await fs.unlink(codePath);
    await fs.unlink(inputPath);
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: output, status: true, executionTime }),
    };

    return response;
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: `${err.message}`, status: false }),
    };

    return response;
  }
}

async function exeCpp(event){
  try {
    const fileName = await generateFileName();
    const { code, input = "" } = JSON.parse(event["body"]);

    const codePath = path.join(tmpDir, fileName + ".cpp");
    const exePath = path.join(tmpDir, fileName + ".exe");
    const inputPath = path.join(tmpDir, fileName + ".txt");

    await fs.writeFile(codePath, code, function (err) {
      if (err) throw err;
    });
    await fs.writeFile(inputPath, input, function (err) {
      if (err) throw err;
    });

    await execAsync(`gcc ${codePath} -o ${exePath}`);
    const startTime = new Date().getTime();
    const { error, stdout, stderr } = await execAsync(
      `${exePath} < ${inputPath}`,
      { timeout: 4000 }
    ).catch((error) => {
      throw error;
    });
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;

    const output = error || stderr || stdout;
    await fs.unlink(codePath);
    await fs.unlink(inputPath);
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: output, status: true, executionTime }),
    };

    return response;
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: `${err.message}`, status: false }),
    };

    return response;
  }
}

async function exeJava(event){
  try {
    const fileName = await generateFileName();
    const { code, input = "" } = JSON.parse(event["body"]);

    const codePath = path.join(tmpDir, fileName + ".java");
    const classPath = path.join(tmpDir, "Main");
    const inputPath = path.join(tmpDir, fileName + ".txt");

    await fs.writeFile(codePath, code, function (err) {
      if (err) throw err;
    });
    await fs.writeFile(inputPath, input, function (err) {
      if (err) throw err;
    });
    
    await execAsync(`javac ${codePath}`)
    const startTime = new Date().getTime();
    const { error, stdout, stderr } = await execAsync(
      `cd ${tmpDir} && java Main < ${inputPath}`,
      { timeout: 4000 }
    ).catch((error) => {
      if (error.killed && error.signal === "SIGTERM"){
        throw new Error("Time Limit Exceeded");
      }
      throw error;
    });
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;

    const output = error || stderr || stdout;
    await fs.unlink(codePath);
    await fs.unlink(inputPath);
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: output, status: true, executionTime }),
    };

    return response;
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: `${err.message}`, status: false }),
    };

    return response;
  }
}

async function exePython(event) {
  try {
    const fileName = await generateFileName();
    const { code, input = "" } = JSON.parse(event["body"]);

    const codePath = path.join(tmpDir, fileName + ".py");
    const inputPath = path.join(tmpDir, fileName + ".txt");

    await fs.writeFile(codePath, code, function (err) {
      if (err) throw err;
    });
    await fs.writeFile(inputPath, input, function (err) {
      if (err) throw err;
    });
    const startTime = new Date().getTime();
    const { error, stdout, stderr } = await execAsync(
      `python3 ${codePath} < ${inputPath}`,
      { timeout: 4000 }
    ).catch((error) => {
      if (error.killed && error.signal === "SIGTERM"){
        throw new Error("Time Limit Exceeded");
      }
      throw error;
    });
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;

    const output = error || stderr || stdout;
    await fs.unlink(codePath);
    await fs.unlink(inputPath);
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: output, status: true, executionTime:executionTime }),
    };

    return response;
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({ data: `${err.message}`, status: false }),
    };

    return response;
  }
}

export const handler = async (event) => {
  // TODO implement
  // const whatis = typeof event;
  // const response = {
  //     statusCode: 200,
  //     code: JSON.stringify(event),
  // }

  // return response;

  const language = event["body"]["language"];
  if (language === "c") return exeC(event);
  if (language === "cpp") return exeCpp(event);
  if (language === "java") return exeJava(event);
  if (language === "python") return exePython(event);

  const response = {
    statusCode: 500,
    headers: {
      "Content-Type": "application/json",
    },
    isBase64Encoded: false,
    body: JSON.stringify({ data: "Invalid Language", status: false }),
  }

  return response;
};
