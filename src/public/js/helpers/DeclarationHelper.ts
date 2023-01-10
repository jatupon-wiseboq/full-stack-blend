// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

declare let window: any;

const Project: any = {};
const settings: {[Identifier: string]: any} = {};

Project.Settings = settings;

if (window.settings) {
  const items = window.settings.toString().split('`');

  for (const item of items) {
    const tokens = item.split('~');
    Project.Settings[tokens[0]] = tokens[1];
  }
}

const DeclarationHelper = {
  declareNamespace: (path: string) => {
    const splited = path.split(".");
    let current = Project;

    splited.forEach((name) => {
      if (current[name] === undefined) {
        current[name] = {};
      }
      current = current[name];
    });

    return current;
  },

  "declare": (level: string, path: string, klass: any) => {
    const splited = path.split(".");
    const name = splited.pop();
    const namespacePath = splited.join(".");

    const namespace = DeclarationHelper.declareNamespace(namespacePath);
    namespace[name] = klass;

    return namespace[name];
  },

  "get": (path: string) => {
    const splited = path.split(".");
    splited.shift();
    let current = Project;

    splited.forEach((name) => {
      if (current[name] === undefined) {
        return null;
      }
      current = current[name];
    });

    return current;
  }
};

export {Project, DeclarationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.