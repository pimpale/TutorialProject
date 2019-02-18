package innexo;

import java.util.List;
import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class EncounterService {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public Encounter getById(int id) {
    String sql = "SELECT id, time, location_id, user_id, type FROM encounter WHERE id=?";
    RowMapper<Encounter> rowMapper = new BeanPropertyRowMapper<Encounter>(Encounter.class);
    Encounter encounter = jdbcTemplate.queryForObject(sql, rowMapper, id);
    return encounter;
  }
  public List<Encounter> getAll() {
    String sql = "SELECT id, time, location_id, user_id, type FROM encounter";
    RowMapper<Encounter> rowMapper = new EncounterRowMapper();
    return this.jdbcTemplate.query(sql, rowMapper);
  }	

  public List<Encounter> query(Integer encounterId, Integer userId, Integer locationId, Timestamp minTime, Timestamp maxTime) {
    String sql = "SELECT id, time, location_id, user_id, type FROM encounter WHERE 1=1 " + 
      (encounterId == null ? "" : " AND id="+encounterId) +
      (userId == null ? "" : " AND user_id="+userId) +
      (locationId == null ? "" : " AND location_id="+locationId) + 
      (minTime == null ? "" : " AND time >= FROM_UNIXTIME(" + minTime.toInstant().getEpochSecond() + ")") + 
      (maxTime == null ? "" : " AND time <= FROM_UNIXTIME(" + maxTime.toInstant().getEpochSecond() + ")");
    RowMapper<Encounter> rowMapper = new EncounterRowMapper();
    return this.jdbcTemplate.query(sql, rowMapper);
  }

  public void add(Encounter encounter) {
    //Add encounter
    String sql = "INSERT INTO encounter (id, time, location_id, user_id, type) values (?, ?, ?, ?, ?)";
    jdbcTemplate.update(sql, encounter.id, encounter.time, encounter.locationId, encounter.userId, encounter.type);

    //Fetch encounter id
    sql = "SELECT id FROM encounter WHERE time=? AND location_id=? AND user_id=? AND type=? ";
    int id = jdbcTemplate.queryForObject(sql, Integer.class, encounter.time, encounter.locationId, encounter.userId, encounter.type);

    //Set encounter id 
    encounter.id = id;
  }

  public void update(Encounter encounter) {
    String sql = "UPDATE encounter SET id=?, time=?, location_id=?, user_id=?, type=? WHERE id=?";
    jdbcTemplate.update(sql, encounter.id, encounter.time, encounter.locationId, encounter.userId, encounter.type, encounter.id);
  }

  public void delete(int id) {
    String sql = "DELETE FROM encounter WHERE id=?";
    jdbcTemplate.update(sql, id);
  }

  public boolean exists(int id) {
    String sql = "SELECT count(*) FROM encounter WHERE id=?";
    int count = jdbcTemplate.queryForObject(sql, Integer.class, id);
    if(count == 0) {
      return false;
    } else {
      return true;
    }
  }
}
