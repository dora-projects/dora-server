import { Test, TestingModule } from '@nestjs/testing';
import { MyConfigModule } from 'libs/datasource/config';
import { MyDatabase, MyElasticModule } from 'libs/datasource';
import { ProjectModule } from './project.module';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule, MyDatabase, MyElasticModule, ProjectModule],
      // providers: [ProjectService],
    }).compile();

    service = moduleRef.get<ProjectService>(ProjectService);
  });

  it('findUserProjects', async () => {
    const res = await service.findUserProjects(1);
    console.log(JSON.stringify(res, null, 2));
  });

  it('findProjectUsers', async () => {
    const res = await service.findProjectUsers(1);
    console.log(JSON.stringify(res, null, 2));
  });

  it('findProjectRoles', async () => {
    const res = await service.findProjectRole(1, 1);
    console.log(JSON.stringify(res, null, 2));
  });

  it('findById', async () => {
    const res = await service.findById(1);
    console.log(JSON.stringify(res, null, 2));
  });
});
