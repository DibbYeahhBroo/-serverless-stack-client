const config = {
    s3: {
        REGION: "US East (N. Virginia) us-east-1",
        BUCKET: "my-notes-api-bucket",
    },
    apiGateway: {
        REGION: "US East (N. Virginia) us-east-1",
        URL: "https://694lxuiq8b.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
        REGION: "US East (N. Virginia) us-east-1",
        USER_POOL_ID: "us-east-1_aivY9OQRw",
        APP_CLIENT_ID: "4cphobjku4io51j37dvj8aebbd",
        IDENTITY_POOL_ID: "us-east-1:385caa93-7279-4e71-aff2-3fab3940ba84",
    },
};
export default config;    