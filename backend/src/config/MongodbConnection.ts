import mongoose from "mongoose";

class MongodbConnection {
    uri: string;
    isConnected: boolean;

    constructor(uri: string | undefined) {
        this.uri = uri || "";
        this.isConnected = false;
    };

    async connect() {
        try {
            await mongoose.connect(this.uri);
            this.isConnected = true;
            console.log("MongoDb connected");
        } catch (error: any) {
            this.isConnected = false;
            console.log("error: ", error.message)
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log("disconnected");
        } catch (error: any) {
            console.log("errror: ", error.message)
        }
    }
}

export default MongodbConnection;