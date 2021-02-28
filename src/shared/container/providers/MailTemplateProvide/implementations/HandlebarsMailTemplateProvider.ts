import {compile} from 'handlebars';
import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import fs from 'fs';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider{
  public async parse({file, variables}: IParseMailTemplateDTO): Promise<string>{
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    })
    const parseTemplate = compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
