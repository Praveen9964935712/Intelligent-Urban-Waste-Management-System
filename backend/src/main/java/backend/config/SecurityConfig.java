package backend.config;


import backend.util.JwtFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

        private final JwtFilter jwtFilter;

public SecurityConfig(JwtFilter jwtFilter) {

    this.jwtFilter = jwtFilter;
}

    @Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

        .requestMatchers(
                "/api/auth/**"
        ).permitAll()

        .requestMatchers(
                "/uploads/**"
        ).permitAll()

        .requestMatchers(
                "/api/dashboard/**"
        ).hasRole("ADMIN")

        .requestMatchers(
                "/api/staff/**"
        ).hasRole("ADMIN")

        .requestMatchers(
                "/api/users/**"
        ).hasRole("ADMIN")

       .requestMatchers(
        "/api/complaints/**"
).authenticated()

        .anyRequest()
        .authenticated()
)

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

    return http.build();
}
}
