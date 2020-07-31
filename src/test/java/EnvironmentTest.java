import org.junit.Test;

import static org.junit.Assert.assertThrows;

public class EnvironmentTest {
    @Test
    public void failsOnDividedByZero() {
        assertThrows(ArithmeticException.class, () -> Integer.valueOf(1 / 0));
    }
}
