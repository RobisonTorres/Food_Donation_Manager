package com.unifecaf.Food_Donation_Manager.Configs;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.scene.control.TextInputDialog;
import javafx.scene.web.PromptData;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.util.Optional;

public class AppWindow extends Application {

    @Override
    public void start(Stage stage) {

        WebView webView = new WebView();

        webView.getEngine().setOnAlert(event -> {
            String data = event.getData();

            if (data != null && data.startsWith("COMMAND:OPEN_BROWSER:")) {
                String targetUrl = data.replace("COMMAND:OPEN_BROWSER:", "");

                getHostServices().showDocument(targetUrl);
                return;
            }

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Food Donation Manager");
            alert.setHeaderText(null);
            alert.setContentText(data);
            alert.show();
        });

        webView.getEngine().setConfirmHandler(message -> {
            Alert confirm = new Alert(
                    Alert.AlertType.CONFIRMATION,
                    message,
                    ButtonType.YES,
                    ButtonType.NO
            );
            confirm.setTitle("Confirmation");
            confirm.setHeaderText(null);

            Optional<ButtonType> result = confirm.showAndWait();
            return result.isPresent() && result.get() == ButtonType.YES;
        });

        webView.getEngine().setPromptHandler((PromptData prompt) -> {
            TextInputDialog dialog = new TextInputDialog(prompt.getDefaultValue());
            dialog.setTitle("Input");
            dialog.setHeaderText(null);
            dialog.setContentText(prompt.getMessage());

            Optional<String> result = dialog.showAndWait();
            return result.orElse(null);
        });

        webView.getEngine().load("http://localhost:8080");

        Scene scene = new Scene(webView, 1280, 720);

        stage.setTitle("Food Donation Manager");
        stage.setScene(scene);

        stage.setOnCloseRequest(event -> {
            Platform.exit();
            System.exit(0);
        });

        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}