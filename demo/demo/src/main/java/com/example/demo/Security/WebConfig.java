package com.example.demo.Security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/videos/**")
                .addResourceLocations("file:C:/Users/imen-/OneDrive/Bureau/projetstage/OpportuNet/demo/uploads/videos/");

        registry.addResourceHandler("/uploads/pdfs/**")
                .addResourceLocations("file:C:/Users/imen-/OneDrive/Bureau/projetstage/OpportuNet/demo/uploads/pdfs/");
        registry.addResourceHandler("/uploads/images/**")   // <-- nouveau handler
                .addResourceLocations("file:C:/Users/imen-/OneDrive/Bureau/projetstage/OpportuNet/demo/uploads/images/");

    }
}
