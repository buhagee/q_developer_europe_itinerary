import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class ItineraryAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    const itineraryTable = new dynamodb.Table(this, 'ItineraryTable', {
      partitionKey: { name: 'date', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Retain data when stack is deleted
    });

    const placesTable = new dynamodb.Table(this, 'PlacesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for querying places by city
    placesTable.addGlobalSecondaryIndex({
      indexName: 'CityIndex',
      partitionKey: { name: 'city', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for querying notes by date
    notesTable.addGlobalSecondaryIndex({
      indexName: 'DateIndex',
      partitionKey: { name: 'date', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Lambda Layer with shared code
    const sharedLayer = new lambda.LayerVersion(this, 'SharedLayer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/layers/shared')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      description: 'Common utilities and shared code',
    });

    // Environment variables for Lambda functions
    const lambdaEnv = {
      ITINERARY_TABLE: itineraryTable.tableName,
      PLACES_TABLE: placesTable.tableName,
      NOTES_TABLE: notesTable.tableName,
    };

    // Lambda Functions
    const getItineraryFunction = new lambda.Function(this, 'GetItineraryFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getItinerary.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/itinerary')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    const getItineraryByDateFunction = new lambda.Function(this, 'GetItineraryByDateFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getItineraryByDate.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/itinerary')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    const updateItineraryFunction = new lambda.Function(this, 'UpdateItineraryFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'updateItinerary.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/itinerary')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    const createNoteFunction = new lambda.Function(this, 'CreateNoteFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'createNote.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/notes')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    const getNotesFunction = new lambda.Function(this, 'GetNotesFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getNotes.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/notes')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    const getPlacesFunction = new lambda.Function(this, 'GetPlacesFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getPlaces.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/places')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    const getPlacesByCityFunction = new lambda.Function(this, 'GetPlacesByCityFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getPlacesByCity.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/places')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });
    
    const createPlaceFunction = new lambda.Function(this, 'CreatePlaceFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'createPlace.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/places')),
      environment: lambdaEnv,
      layers: [sharedLayer],
    });

    // Grant permissions to Lambda functions
    itineraryTable.grantReadData(getItineraryFunction);
    itineraryTable.grantReadData(getItineraryByDateFunction);
    itineraryTable.grantReadWriteData(updateItineraryFunction);
    
    placesTable.grantReadData(getPlacesFunction);
    placesTable.grantReadData(getPlacesByCityFunction);
    placesTable.grantWriteData(createPlaceFunction);
    
    notesTable.grantReadWriteData(createNoteFunction);
    notesTable.grantReadData(getNotesFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ItineraryApi', {
      restApiName: 'Europe Itinerary API',
      description: 'API for Europe Travel Itinerary App',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent'],
        allowCredentials: true
      },
      deployOptions: {
        stageName: 'prod',
        // Use minimal deployment settings to reduce costs
        cachingEnabled: false,
        // Disable logging to avoid CloudWatch Logs role requirement
        loggingLevel: apigateway.MethodLoggingLevel.OFF,
      },
    });

    // API Resources and Methods
    const itineraryResource = api.root.addResource('itinerary');
    itineraryResource.addMethod('GET', new apigateway.LambdaIntegration(getItineraryFunction));
    
    const itineraryDateResource = itineraryResource.addResource('{date}');
    itineraryDateResource.addMethod('GET', new apigateway.LambdaIntegration(getItineraryByDateFunction));
    itineraryDateResource.addMethod('PUT', new apigateway.LambdaIntegration(updateItineraryFunction));
    
    const notesResource = api.root.addResource('notes');
    notesResource.addMethod('GET', new apigateway.LambdaIntegration(getNotesFunction));
    notesResource.addMethod('POST', new apigateway.LambdaIntegration(createNoteFunction));
    
    const placesResource = api.root.addResource('places');
    placesResource.addMethod('GET', new apigateway.LambdaIntegration(getPlacesFunction));
    placesResource.addMethod('POST', new apigateway.LambdaIntegration(createPlaceFunction));
    
    const placesCityResource = placesResource.addResource('{city}');
    placesCityResource.addMethod('GET', new apigateway.LambdaIntegration(getPlacesByCityFunction));

    // Frontend hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: true,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      httpVersion: cloudfront.HttpVersion.HTTP2,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use only North America and Europe edge locations to reduce costs
    });

    // Deployment for frontend assets
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../frontend/build'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Website URL',
    });
  }
}
