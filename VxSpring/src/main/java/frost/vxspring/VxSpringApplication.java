package frost.vxspring;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("frost.vxspring.mapper")
@SpringBootApplication(scanBasePackages = "frost.vxspring")
public class VxSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(VxSpringApplication.class, args);
	}

}
