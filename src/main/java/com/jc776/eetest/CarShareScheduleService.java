package com.jc776.eetest;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

import javax.faces.view.ViewScoped;
import javax.inject.Named;

import org.primefaces.event.SelectEvent;
import org.primefaces.model.DefaultScheduleEvent;
import org.primefaces.model.LazyScheduleModel;
import org.primefaces.model.ScheduleEvent;

@Named("carShareScheduleService")
@ViewScoped
public class CarShareScheduleService implements Serializable {
  class ScheduleModel extends LazyScheduleModel {
    private static final long serialVersionUID = 1L;

    @Override
    public void loadEvents(final Date start, final Date end) {
      for (final Date date : CarShareScheduleService.this.getDates()) {
        this.addEvent(new DefaultScheduleEvent("Day", date, date, true));
      }
    }
  }

  private static final long serialVersionUID = 1L;
  // private static final Logger log = Logger
  // .getLogger(CarShareScheduleService.class);
  // Step 1
  // - from/to
  // - "adjust route"
  // - as passenger/driver/both
  // - pick regular/one-off/custom
  // Step 2
  // - schedule start, schedule end (now plus a few months)
  // - toggle (selected month's) weeks/days
  // - simpler "recuring" schedule?
  private final Set<Date> dates = new TreeSet<>();
  private ScheduleModel scheduleModel;

  public Set<Date> getDates() {
    return this.dates;
  }

  public ScheduleModel getEventModel() {
    if (this.scheduleModel == null) {
      this.scheduleModel = new ScheduleModel();
    }
    return this.scheduleModel;
  }

  public void onDateSelect(final SelectEvent selectEvent) {
    this.toggleDate((Date) selectEvent.getObject(), "dateSelect"); //$NON-NLS-1$
  }

  public void onEventSelect(final SelectEvent selectEvent) {
    final ScheduleEvent event = (ScheduleEvent) selectEvent.getObject();
    this.toggleDate(event.getStartDate(), "eventSelect"); //$NON-NLS-1$
  }

  public void toggleDate(final Date newDate, final String test) {
    boolean alreadySet = false;
    for (final Date date : this.dates) {
      if (DateHelper.matchDateOnly(date, newDate)) {
        alreadySet = true;
      }
    }
    if (alreadySet) {
      this.dates.removeIf(date -> DateHelper.matchDateOnly(date, newDate));
    } else {
      this.dates.add(newDate);
    }
  }
}
