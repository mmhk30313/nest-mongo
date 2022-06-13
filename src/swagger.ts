import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
    .setTitle('My Nesjs Mongo API')
    .setDescription("The Nestjs Mongo API Description")
    .setVersion('1.0.0')
    // .addTag("CRUD-Operation")
    // .addTag("User-Login")
    .addTag("User CRUD")
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api', app, document);
}