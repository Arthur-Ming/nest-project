import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './features/blogs/blogs.module';
import appSettings from './settings/app-settings';

@Module({
  imports: [MongooseModule.forRoot(appSettings.mongoUrl + '/' + 'blogger_platform'), BlogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
