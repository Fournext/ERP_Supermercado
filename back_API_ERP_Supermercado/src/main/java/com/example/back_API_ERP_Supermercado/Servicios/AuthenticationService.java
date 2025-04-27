package com.example.back_API_ERP_Supermercado.Servicios;


import com.example.back_API_ERP_Supermercado.Entidad.AuthenticationResponse;
import com.example.back_API_ERP_Supermercado.Entidad.userET;
import com.example.back_API_ERP_Supermercado.Repositorio.userRP;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final userRP userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(userET user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return AuthenticationResponse.builder()
                .token(jwtService.generateToken(user))
                .build();
    }

    public AuthenticationResponse authenticate(userET user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );

        var authenticatedUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow();

        return AuthenticationResponse.builder()
                .token(jwtService.generateToken(authenticatedUser))
                .build();
    }
}
