from django.shortcuts import render, redirect
from projects.models import Project
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.template import loader
from .forms import ContactForm
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib import messages
from .models import Profile, FilePDF
from django.contrib.auth.models import User
from django.http import HttpResponse
from blog.models import Post, Tag
from collections import OrderedDict
from django.utils import timezone


# Global variable for objects per paginated pages in the case of Projects.
PAGINATION_OBJECTS_PER_PAGE = 2


def core_app_view(request):
    """
    Creates the view of the landing page.
    :param request: The Http request that contains metadata about the request.
    :return: Renders the base.html file using the request and the context.
    """
    # Ordered dictionary for projects.
    projects_as_dict = OrderedDict()

    # Get every row in the Tag table.
    tags = Tag.objects.all()

    # Exclude some of the tags that are not relevant in the Project section.
    tags_project_mask = [tag for tag in tags if tag.name not in ["My Journey"]]

    # Iterate over each tag in the masked tags to separate and paginate projects.
    for tag in tags_project_mask:

        # Filter projects with the current tag, and order them based on the posting date.
        projects = Project.objects.filter(tags=tag).order_by('-date_posted')

        # Paginate the projects.
        paginator = Paginator(projects, PAGINATION_OBJECTS_PER_PAGE)

        # Set the starting page (only set the base.html rendered) to 1.
        page = 1

        # Make sure that pagination is free from errors.
        try:
            projects = paginator.page(page)
        except PageNotAnInteger:
            projects = paginator.page(2)
        except EmptyPage:
            projects = paginator.page(paginator.num_pages)

        # Insert paginated projects at the corresponding tag. Note tha one project may appear for more than one tag.
        projects_as_dict[tag] = projects

    # POST request can be:
    # (1) contact form sent
    # (2) changing Projects pagination page
    if request.method == 'POST':

        # Get the completed form.
        form = ContactForm(request.POST)

        # If the completed form is valid, process content.
        if form.is_valid():

            # Save form content, and extract information.
            form.save()
            form_submission_timestamp = timezone.now()
            name = form.cleaned_data['name']
            subject = form.cleaned_data['subject']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']

            # Prepare incoming message to be sent to myself, convert it to an EmailMessage, and send email to myself.
            incoming_message = {
                "subject": subject + " from {0}, through Django".format(name),
                "body":
                    subject + "\n\n" + message +
                    "\n\nTo self: I received this email from '{0}', email: '{1}' (form submitted {2})".format(
                        name, email, form_submission_timestamp)
            }

            incoming_email = EmailMessage(
                subject=incoming_message["subject"],
                body=incoming_message["body"],
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER])

            incoming_email.send(fail_silently=False)

            # Prepare thank you message to be sent to myself, convert it to an EmailMessage, and send email to myself.
            thank_you_message = {
                "subject": "Thank you for contacting me! (Mark Csizmadia)",
                "body": ("Dear {0},\n\nThank you for contacting me!\n\n"
                         "I hope you enjoyed browsing through my website. "
                         "I will get back to you within 24 hours!\n\n"
                         "Kind Regards,\nMark Csizmadia".format(name))
            }

            thank_you_email = EmailMessage(
                subject=thank_you_message["subject"],
                body=thank_you_message["body"],
                from_email=settings.EMAIL_HOST_USER,
                to=[email])

            thank_you_email.send(fail_silently=False)

            # Feedback message shown to user on top of page to confirm that they contacted me successfully via email.
            messages.success(request, f'Thank you for your message, {name}!')

            # Redirect to the core app view.
            return redirect('core_app_view')

        # If form is invalid, do not do anything.
        else:
            pass

    # If not POST request, create a new form.
    else:
        form = ContactForm()

    # Get all blog posts to show statistics to user about blog.
    posts = Post.objects.all().order_by('-date_posted')

    # Date of posting of the latest blog post.
    latest_post_date = posts[0].date_posted

    # Calculate the overall reading time of all of the blog posts (showing off with a nested list comprehension).
    overall_reading_time_mins = \
        sum([int(readtime_mins) for post in Post.objects.all()
            for readtime_mins in post.post_readtime.split() if readtime_mins.isdigit()])

    # Build context for accessing data in HTML.
    context = {
        # The title of the html page.
        "title": "Portfolio",
        # The contact form.
        "form": form,
        # My profile for showing the portrait of me.
        "mark_profile": Profile.objects.get(user=User.objects.get(username="mark")),
        # My CV as PDF.
        "cv_file_object": FilePDF.objects.get(identifier="cv"),
        # The BEng thesis as PDF.
        "project_report_file_object": FilePDF.objects.get(identifier="project_report"),
        # The internship report as PDF.
        "internship_report_file_object": FilePDF.objects.get(identifier="internship_report"),
        # Projects as ordered dictionary.
        "projects_as_dict": projects_as_dict,
        # All of the tags (not the masked version). To show statistics to user about blog in Blog section.
        "tags": tags,
        # The date of the latest post.
        "latest_post_date": latest_post_date,
        # Overall reading time of all of the posts.
        "overall_reading_time": overall_reading_time_mins,
        # The number of posts in the blog.
        "number_of_posts": len(posts),
    }
    # Render the landing page with all the data in context and metadata in request.
    return render(request, 'core_app/base.html', context)


def projects_filter_view_lazy(request):
    """
    Lazy load the paginated projects page after page. Lazy load allows the app not re-render the page, but to just
    lazily load new paginated projects via POST requests.
    :param request: The Http request that contains metadata about hte request.
    :return: A JSON object that is used to load new paginated projects.
    """
    # Get the page from the POST request metadata to be used to lazily load the paginated projects.
    page = request.POST.get('page')

    # Get the tag slug from the POST request metadata to retrieve the filter tag.
    tag_slug = request.POST.get('tag_slug')

    # Retrieve the filter tag from the Tag table.
    t = Tag.objects.get(slug=tag_slug)

    # Filter and order projects with the filter tag.
    projects = Project.objects.filter(tags=t).order_by('-date_posted')

    # Use Django's pagination to paginate the the filtered projects.
    # https://docs.djangoproject.com/en/dev/topics/pagination/
    paginator = Paginator(projects, PAGINATION_OBJECTS_PER_PAGE)

    # Make sure that the page to be loaded is free from errors.
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        projects = paginator.page(2)
    except EmptyPage:
        projects = paginator.page(paginator.num_pages)

    # Build the main HTML in the Projects section (with all of the paginated projects)
    # and load as string to be wrapped into a JSON object.
    project_html = loader.render_to_string(
        'core_app/project.html',
        {'projects': projects}
    )

    # Package the output data and return it as a JSON object. Includes the main HTML in the Projects section (with all
    # of the paginated projects) and if the paginated page has a next page that could be lazily loaded.
    output_data = {
        'project_html': project_html,
        'has_next': projects.has_next()
    }

    # Return the JSON object for the layz load.
    return JsonResponse(output_data)


def download_pdf(request, pdf_file_identifier):
    """

    :param request: The Http request that contains metadata about the request.
    :param pdf_file_identifier: the string identifier of the PDF object to be downloaded
    :return: response that starts the download process of the PDF file (does NOT render or redirect)
    """
    # Retrieve the desired PDF object.
    file_object = FilePDF.objects.get(identifier=pdf_file_identifier)

    # Build the response.
    response = HttpResponse(file_object.pdf, content_type='text/plain')

    # Specify that the response is a download and no render or redirect is needed.
    response['Content-Disposition'] = 'attachment; filename={0}'.format(file_object.title + ".pdf")

    # Return the download response.
    return response

