package repository

// func createFormBodyIndices(db *mongo.Database) error {
// 	formsBodyIndexModel := mongo.IndexModel{
// 		Keys:    bson.D{{Key: "form_id", Value: 1}},
// 		Options: options.Index().SetUnique(true),
// 	}

// 	if _, err := db.Collection(FORM_BODY_COLLECTION_NAME).Indexes().CreateOne(context.TODO(), formsBodyIndexModel); err != nil {
// 		return err
// 	}
// 	return nil
// }

// func CreateMongoCollectionIndices() error {
// mongoDb, err := utils.GetMongoDB()
// if err != nil {
// 	return err
// }

// if err := createFormBodyIndices(mongoDb); err != nil {
// 	return err
// }

// fmt.Println("CreateMongoCollectionIndices successful")
// 	return nil
// }
