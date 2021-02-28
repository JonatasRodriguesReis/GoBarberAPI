import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class FakeEmailTemplateProvider implements IMailTemplateProvider{
  public async parse(): Promise<string>{
    return 'Mail Content';
  }
}

export default FakeEmailTemplateProvider;
