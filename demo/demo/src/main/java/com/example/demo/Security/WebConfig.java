package com.example.demo.Security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/videos/**")
                .addResourceLocations("file:C:/Users/azizc/Desktop/Nouveau dossier/demo/uploads/videos/");

        registry.addResourceHandler("/uploads/pdfs/**")
                .addResourceLocations("file:C:/Users/azizc/Desktop/Nouveau dossier/demo/uploads/pdfs/");
        registry.addResourceHandler("/uploads/images/**")   // <-- nouveau handler
                .addResourceLocations("file:C:/Users/azizc/Desktop/Nouveau dossier/demo/uploads/images/");

    }

}
